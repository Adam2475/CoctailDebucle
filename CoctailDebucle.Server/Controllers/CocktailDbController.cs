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

namespace CoctailDebucle.Server.Controllers
{
    [Route("api/drinkDb")]
    [ApiController]
    public class CocktailDbController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CocktailDbController(AppDbContext context)
        {
            _context = context;
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
        // Get all drinks with ingredients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Drink>>> GetDbDrinks()
        {
            var drinks = await _context.Drinks
                .Include(d => d.Glass)
                .AsNoTracking() // Prevent tracking issues
                .ToListAsync();

            return Ok(drinks);
        }
        // Get a specific drink by ID
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

        // Add a new drink with ingredients
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
                ImageUrl = imageUrl  // return public URL to the frontend
            });
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Drink>>> GetDrinksByUserId(int userId)
        {
            var drinks = await _context.Drinks
                .Where(d => d.UserId == userId)
                .Include(d => d.Glass)
                .Include(d => d.DrinkIngredients)
                    .ThenInclude(di => di.Ingredient)
                .ToListAsync();

            return Ok(drinks);
        }
    }

    //[HttpPost("save-selection")]
    //    public async Task<IActionResult> SaveSelection([FromBody] List<DrinkDTO> selectedDrinks)
    //    {
    //        if (selectedDrinks == null || !selectedDrinks.Any())
    //            return BadRequest("No drinks selected.");

    //        // Process the selected drinks
    //        var userId = GetCurrentUserId(); // Get user id from the current session or authentication

    //        var selection = new Selection
    //        {
    //            UserId = userId,
    //            Drinks = new List<Drink>()
    //        };

    //        foreach (var drinkDto in selectedDrinks)
    //        {
    //            var drink = new Drink
    //            {
    //                Name = drinkDto.Name,
    //                Category = drinkDto.Category,
    //                GlassId = drinkDto.GlassId,
    //                Instructions = drinkDto.Instructions,
    //                UserId = userId,  // Assign to the current user
    //                ImagePath = drinkDto.ImagePath != null ? SaveImage(drinkDto.ImagePath) : null,  // If image exists, save it
    //                DrinkIngredients = drinkDto.Ingredients.Select(i => new DrinkIngredient
    //                {
    //                    IngredientId = i.IngredientId,
    //                    Amount = i.Amount
    //                }).ToList()
    //            };

    //            selection.Drinks.Add(drink);
    //        }

    //        _context.Selections.Add(selection); // Add selection to DB
    //        await _context.SaveChangesAsync();  // Save changes

    //        return Ok("Selection saved successfully.");
    //    }

    //private string SaveImage(IFormFile image)
    //    {
    //        if (image == null) return null;

    //        var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", Guid.NewGuid().ToString() + Path.GetExtension(image.FileName));

    //        using (var stream = new FileStream(imagePath, FileMode.Create))
    //        {
    //            image.CopyTo(stream);
    //        }

    //        return imagePath; // Return the image path to save in DB
    //    }
}
