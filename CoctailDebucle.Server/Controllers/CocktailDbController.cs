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

        //[HttpPost]
        //[ProducesResponseType(typeof(CreateDrinkDTO), StatusCodes.Status201Created)]
        //public async Task<ActionResult<Drink>> CreateDrink([FromForm] CreateDrinkDTO drinkDto)
        //{
        //    // Deserialize ingredients
        //    List<DrinkIngredientDto> ingredients;
        //    try
        //    {
        //        ingredients = JsonSerializer.Deserialize<List<DrinkIngredientDto>>(drinkDto.IngredientsJson);
        //    }
        //    catch
        //    {
        //        return BadRequest("Invalid ingredients format.");
        //    }

        //    // Save image to wwwroot/images
        //    string fileName = null;
        //    if (drinkDto.Image != null && drinkDto.Image.Length > 0)
        //    {
        //        fileName = Guid.NewGuid().ToString() + Path.GetExtension(drinkDto.Image.FileName);
        //        var filePath = Path.Combine("wwwroot/images", fileName);
        //        using (var stream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await drinkDto.Image.CopyToAsync(stream);
        //        }
        //    }

        //    // Build drink entity
        //    var drink = new Drink
        //    {
        //        Name = drinkDto.Name,
        //        Category = drinkDto.Category,
        //        GlassId = drinkDto.GlassId,
        //        Instructions = drinkDto.Instructions,
        //        ImagePath = fileName != null ? "/images/" + fileName : null,
        //        DrinkIngredients = ingredients.Select(i => new DrinkIngredient
        //        {
        //            IngredientId = i.IngredientId,
        //            Amount = i.Amount
        //        }).ToList()
        //    };

        //    _context.Drinks.Add(drink);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetDbDrink), new { id = drink.Id }, drink);
        //}
        //}
        // Add a new drink with ingredients
        //[HttpPost]
        //public async Task<ActionResult<Drink>> CreateDrink([FromForm] CreateDrinkDTO drinkDto)
        //{
        //    List<DrinkIngredientDTO> ingredients;
        //    try
        //    {
        //        var options = new JsonSerializerOptions
        //        {
        //            PropertyNameCaseInsensitive = true
        //        };
        //        //Console.WriteLine("Ingredients from the controller: ", drinkDto.IngredientsJson);
        //        ingredients = JsonSerializer.Deserialize<List<DrinkIngredientDTO>>(drinkDto.IngredientsJson);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest($"Invalid ingredients format. Error: {ex.Message}");
        //    }
        //    var drink = new Drink
        //    {
        //        Name = drinkDto.Name,
        //        Category = drinkDto.Category,
        //        GlassId = drinkDto.GlassId,
        //        Instructions = drinkDto.Instructions,
        //        DrinkIngredients = ingredients.Select(i => new DrinkIngredient
        //        {
        //            IngredientId = i.IngredientId,
        //            Amount = i.Amount
        //        }).ToList()

        //    };

        //    _context.Drinks.Add(drink);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetDbDrink), new { id = drink.Id }, drink);
        //}

        //[HttpPost]
        //public async Task<ActionResult<Drink>> CreateDrink([FromForm] DrinkDTO drinkDto)
        //{
        //    List<DrinkIngredientDto> ingredients;
        //    //ingredients = System.Text.Json.JsonSerializer.Deserialize<List<DrinkIngredientDto>>(drinkDto.Ingredients);
        //    ingredients = JsonConvert.DeserializeObject<List<DrinkIngredientDto>>(drinkDto.Ingredients);
        //    var drink = new Drink
        //    {
        //        Name = drinkDto.Name,
        //        Category = drinkDto.Category,
        //        GlassId = drinkDto.GlassId,
        //        Instructions = drinkDto.Instructions,
        //        DrinkIngredients = ingredients.Select(i => new DrinkIngredient
        //        {
        //            IngredientId = i.IngredientId,
        //            Amount = i.Amount
        //        }).ToList()
        ////DrinkIngredients = drinkDto.Ingredients.Select(i => new DrinkIngredient
        ////{
        ////    IngredientId = i.IngredientId,
        ////    Amount = i.Amount
        ////}).ToList()
        //    };

        //    //Save image to wwwroot/images
        //    //string fileName = null;
        //    //if (drinkDto.Image != null && drinkDto.Image.Length > 0)
        //    //{
        //    //    fileName = Guid.NewGuid().ToString() + Path.GetExtension(drinkDto.Image.FileName);
        //    //    var filePath = Path.Combine("wwwroot/images", fileName);
        //    //    using (var stream = new FileStream(filePath, FileMode.Create))
        //    //    {
        //    //        await drinkDto.Image.CopyToAsync(stream);
        //    //    }
        //    //}

        //    _context.Drinks.Add(drink);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetDbDrink), new { id = drink.Id }, drink);
        //}

        // Add a new drink with ingredients
        [HttpPost]
        public async Task<ActionResult<Drink>> CreateDrink([FromBody] DrinkDTO drinkDto)
        {
            var drink = new Drink
            {
                Name = drinkDto.Name,
                Category = drinkDto.Category,
                GlassId = drinkDto.GlassId,
                Instructions = drinkDto.Instructions,
                DrinkIngredients = drinkDto.Ingredients.Select(i => new DrinkIngredient
                {
                    IngredientId = i.IngredientId,
                    Amount = i.Amount
                }).ToList()
            };

            _context.Drinks.Add(drink);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDbDrink), new { id = drink.Id }, drink);
        }

        [HttpPost("uploadImage/{drinkId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage(int drinkId, [FromForm] ImageUploadDTO dto)
        {
            var image = dto.ImagePath;
            if (image == null || image.Length == 0)
                return BadRequest("No image file provided.");


            // ✅ Define the upload folder
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            // ✅ Make sure the directory exists
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
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Image uploaded successfully." });
        }
    }
}
