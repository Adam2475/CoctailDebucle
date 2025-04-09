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
