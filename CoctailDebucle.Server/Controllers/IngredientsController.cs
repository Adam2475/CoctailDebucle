using CoctailDebucle.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace CoctailDebucle.Server.Controllers
{
    [ApiController]
    [Route("api/drinkDb/ingredients")]
    [EnableCors("AllowAngularApp")]
    public class IngredientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public IngredientsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SaveIngredients([FromBody] List<NameDto> ingredients)
        {
            foreach (var dto in ingredients)
            {
                var exists = await _context.Glasses
                    .AnyAsync(g => g.Name.ToLower() == dto.Name.ToLower());
                if (!_context.Ingredients.Any(i => i.IngredientName == dto.Name))
                {
                    _context.Ingredients.Add(new Ingredient { IngredientName = dto.Name });
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
