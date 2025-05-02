using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CoctailDebucle.Server.Models;
using System.Text.Json;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;

namespace CoctailDebucle.Server.Controllers
{
    [Route("api/drinkDb")]
    [ApiController]
    public class CocktailDbController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CocktailDbController> _logger;
        public CocktailDbController(AppDbContext context, ILogger<CocktailDbController> logger)
        {
            _context = context;
            _logger = logger;
        }


        [HttpGet("ingredients")]
        public async Task<ActionResult<IEnumerable<IngredientDTO>>> GetIngredients()
        {
            var ingredients = await _context.Ingredients
                .Select(i => new IngredientDTO
                {
                    Id = i.Id,
                    Name = i.IngredientName
                })
                .ToListAsync();

            return Ok(ingredients);
        }

        [HttpGet("glasses")]
        public async Task<ActionResult<IEnumerable<Glass>>> GetGlasses()
        {
            var glasses = await _context.Glasses.ToListAsync();
            return Ok(glasses);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Drink>>> GetDbDrinks()
        {
            var drinks = await _context.Drinks
                .Include(d => d.Glass)
                .AsNoTracking() // Prevent tracking issues
                .ToListAsync();

            return Ok(drinks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Drink>> GetDbDrink(int id)
            {
                var drink = await _context.Drinks
                    .Include(d => d.Glass)
                    .Include(d => d.DrinkIngredients)
                        .ThenInclude(di => di.Ingredient)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (drink == null)
                {
                    return NotFound("Drink not found.");
                }

                return drink;
            }

        [HttpPost("createdrink")]
        public async Task<ActionResult<Drink>> CreateDrink([FromBody] DrinkDTO drinkDto)
        {
            // Check for duplicate name
            bool exists = await _context.Drinks
                .AnyAsync(d => d.Name.ToLower() == drinkDto.Name.ToLower());

            if (exists)
            {
                return Conflict(new { message = "A drink with this name already exists." });
            }

            var drink = new Drink
            {
                Name = drinkDto.Name,
                Category = drinkDto.Category,
                GlassId = drinkDto.GlassId,
                UserId = drinkDto.UserId,
                Instructions = drinkDto.Instructions,
                IsCreatedByUser = true,
                DrinkIngredients = drinkDto.Ingredients.Select(i => new DrinkIngredient
                {
                    IngredientId = i.IngredientId,
                    Amount = i.Amount
                }).ToList()
            };

            _context.Drinks.Add(drink);
            await _context.SaveChangesAsync(); // error line

            return CreatedAtAction(nameof(GetDbDrink), new { id = drink.Id }, drink);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDrink(int id, [FromBody] DrinkDTO drinkDto)
        {
            var drink = await _context.Drinks
                .Include(d => d.DrinkIngredients)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (drink == null)
            {
                return NotFound("Drink not found.");
            }

            // Update basic fields
            drink.Name = drinkDto.Name;
            drink.Category = drinkDto.Category;
            drink.GlassId = drinkDto.GlassId;
            // dont change the user Id
            //drink.UserId = drinkDto.UserId;
            drink.Instructions = drinkDto.Instructions;

            // Update ingredients
            _context.DrinkIngredients.RemoveRange(drink.DrinkIngredients); // Remove old ones
            drink.DrinkIngredients = drinkDto.Ingredients.Select(i => new DrinkIngredient
            {
                IngredientId = i.IngredientId,
                Amount = i.Amount,
                DrinkId = id
            }).ToList();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDrink(int id)
        {
            var drink = await _context.Drinks
                .Include(d => d.DrinkIngredients)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (drink == null)
            {
                return NotFound("Drink not found.");
            }

            // Remove related ingredients first
            _context.DrinkIngredients.RemoveRange(drink.DrinkIngredients);

            _context.Drinks.Remove(drink);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("uploadImage/{drinkId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage(int drinkId, [FromForm] ImageUploadDTO dto)
        {
            var image = dto.ImagePath;
            if (image == null || image.Length == 0)
                return BadRequest("No image file provided.");


            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Assume you have a service or logic to save the image file.
            // For example, save the file to disk or to cloud storage.
            var filePath = Path.Combine("wwwroot", "images", image.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Optionally, update the drink record with the image URL/path.
            var drink = await _context.Drinks.FindAsync(drinkId);
            if (drink == null)
            {
                return NotFound();
            }
            drink.ImagePath = "/images/" + image.FileName;
            var imageRelativePath = $"/images/{image.FileName}";
            var imageUrl = $"{Request.Scheme}://{Request.Host}{imageRelativePath}";
            await _context.SaveChangesAsync();

            return Ok(new { 
                Message = "Image uploaded successfully.",
                ImagePath = imageUrl  // return public URL to the frontend
            });
        }

        // Saving Full image into the DB

        [HttpPost("uploadImageToDb/{drinkId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImageToDb(int drinkId, [FromForm] ImageUploadDTO dto)
        {
            var file = dto.ImagePath;
            if (file == null || file.Length == 0)
                return BadRequest("No image file provided.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var imageData = memoryStream.ToArray();

            var drink = await _context.Drinks.FindAsync(drinkId);
            if (drink == null)
                return NotFound();

            drink.ImageData = imageData;
            drink.ImageMimeType = file.ContentType;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Image uploaded successfully." });
        }

        // Get Drink image from the DB

        [HttpGet("{drinkId}/image")]
        public async Task<IActionResult> GetDrinkImage(int drinkId)
        {
            var drink = await _context.Drinks.FindAsync(drinkId);
            if (drink == null || drink.ImageData == null)
                return NotFound();

            return File(drink.ImageData, drink.ImageMimeType ?? "image/jpeg");
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Drink>>> GetDrinksByUserId(int userId)
        {
            var drinks = await _context.Drinks
                .Where(d => d.UserId == userId && d.IsCreatedByUser == true)
                .Include(d => d.Glass)
                .Include(d => d.DrinkIngredients)
                    .ThenInclude(di => di.Ingredient)
                .ToListAsync();

            return Ok(drinks);
        }

        [HttpPost("savedrink")]
        public async Task<IActionResult> SaveDrink([FromBody] DrinkDTO dto)
        {
            if (dto.ImageData == null || dto.ImageData.Length == 0)
            {
                return BadRequest("No image data provided.");
            }

            // Check for existing drink by name (case-insensitive)
            var existingDrink = await _context.Drinks
                .FirstOrDefaultAsync(d => d.Name.ToLower() == dto.Name.ToLower());

            if (existingDrink != null)
            {
                // Return info indicating it's a duplicate
                return Ok(new
                {
                    id = existingDrink.Id,
                    name = existingDrink.Name,
                    duplicate = true,
                    message = "Drink already exists. Not added again."
                });
            }

            // Find glass
            var glass = await _context.Glasses.FirstOrDefaultAsync(g => g.Id == dto.GlassId);
            if (glass == null)
            {
                return BadRequest($"Glass with ID '{dto.GlassId}' not found.");
            }

            // Create and save drink
            var newDrink = new Drink
            {
                Name = dto.Name,
                Category = dto.Category,
                Instructions = dto.Instructions,
                GlassId = glass.Id,
                UserId = dto.UserId,
                ImageData = dto.ImageData,
                ImageMimeType = dto.ImageMimeType
            };

            _context.Drinks.Add(newDrink);
            await _context.SaveChangesAsync(); // Generate ID

            // Link ingredients
            foreach (var ing in dto.Ingredients)
            {
                var dbIngredient = await _context.Ingredients.FirstOrDefaultAsync(i => i.Id == ing.IngredientId);
                if (dbIngredient != null)
                {
                    _context.DrinkIngredients.Add(new DrinkIngredient
                    {
                        DrinkId = newDrink.Id,
                        IngredientId = dbIngredient.Id,
                        Amount = ing.Amount
                    });
                }
                else
                {
                    return BadRequest($"Ingredient with ID '{ing.IngredientId}' not found.");
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = newDrink.Id,
                name = newDrink.Name,
                duplicate = false,
                message = "Drink saved successfully"
            });
        }

        private async Task<string?> DownloadImageAsync(string imageUrl)
        {
            _logger.LogInformation("Received imageUrl: {ImageUrl}------------------------------------------------------------------------------------", imageUrl);
            //Console.WriteLine("Received imageUrl---------------------------------------------------------------------------------------------: " + imageUrl);
            if (string.IsNullOrEmpty(imageUrl))
                return null;

            var client = new HttpClient();
            var imageBytes = await client.GetByteArrayAsync(imageUrl);
            var fileName = $"{Guid.NewGuid()}.jpg";
            var filePath = Path.Combine("wwwroot", "images", fileName);
            await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

            return $"/images/{fileName}";
        }
    }

}
