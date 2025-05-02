using CoctailDebucle.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net.NetworkInformation;

namespace CoctailDebucle.Server.Controllers
{
    [ApiController]
    [Route("api/drinkDb/ingredients")]
    [EnableCors("AllowAngularApp")]
    public class IngredientsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CocktailDbController> _logger;

        public IngredientsController(AppDbContext context, ILogger<CocktailDbController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SaveIngredients([FromBody] List<NameDto> ingredients)
        {
            _logger.LogInformation("Received ingredients: {Count}", ingredients?.Count ?? 0);
            foreach (var dto in ingredients)
            {
                if (string.IsNullOrWhiteSpace(dto?.Name))
                    continue;

                var exists = await _context.Ingredients
                    .AnyAsync(i => i.IngredientName.ToLower() == dto.Name.ToLower());

                _logger.LogInformation("Checking ingredient: {Name} | Exists: {Exists}", dto.Name, exists);

                if (!exists)
                {
                    Console.WriteLine("Adding ingredient");
                    _context.Ingredients.Add(new Ingredient { IngredientName = dto.Name.Trim() });
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
