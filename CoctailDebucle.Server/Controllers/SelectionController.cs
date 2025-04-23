using CoctailDebucle.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;


namespace CoctailDebucle.Server.Controllers
{
    [ApiController]
    [Route("api/selection")]
    public class SelectionController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SelectionController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllSelections()
        {
            var selections = await _context.Selections
                .Include(s => s.User)
                .Include(s => s.Drinks)
                .Select(s => new
                {
                    s.Id,
                    UserName = s.User.Name,
                    s.CreationDate,
                    s.isActive,
                    DrinkCount = s.Drinks.Count
                })
                .ToListAsync();

            return Ok(selections);
        }
        [HttpPost("add-selection")]
        public async Task<IActionResult> AddSelection([FromBody] SelectionDto selectionDto)
        {
            if (selectionDto == null || selectionDto.DrinkIds == null || !selectionDto.DrinkIds.Any())
            {
                return BadRequest("Invalid selection data.");
            }

            var user = await _context.Users.FindAsync(selectionDto.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var drinks = await _context.Drinks
                .Where(d => selectionDto.DrinkIds.Contains(d.Id))
                .ToListAsync();

            if (!drinks.Any())
            {
                return NotFound("No drinks found with the given IDs.");
            }

            var selection = new Selection
            {
                UserId = selectionDto.UserId,
                CreationDate = DateTime.Now,
                isActive = true,
                Drinks = drinks
            };

            _context.Selections.Add(selection);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Selection saved successfully!", selectionId = selection.Id });
        }

        [HttpGet("active-selections")]
        public async Task<IActionResult> GetActiveSelections()
        {
            var selections = await _context.Selections
                .Where(s => s.isActive)
                .Include(s => s.User)
                .Include(s => s.Drinks)
                .ThenInclude(d => d.DrinkIngredients)
                .ThenInclude(di => di.Ingredient)
                .ToListAsync();

            var result = selections.Select(s => new {
                s.Id,
                s.UserId,
                UserName = s.User?.Name,
                s.CreationDate,
                DrinkCount = s.Drinks.Count,
                Drinks = s.Drinks.Select(d => new {
                    d.Id,
                    d.Name,
                    d.Category,
                    d.ImagePath,
                    Ingredients = d.DrinkIngredients.Select(di => new {
                        di.IngredientId,
                        IngredientName = di.Ingredient.IngredientName,
                        di.Amount
                    })
                })
            });

            return Ok(result);
        }

        [HttpPut("toggle-selection-list/{id}")]
        public async Task<IActionResult> ToggleSelection(int id)
        {
            var selection = await _context.Selections.FindAsync(id);
            if (selection == null) return NotFound("Selection not found.");

            selection.isActive = !selection.isActive;
            await _context.SaveChangesAsync();

            return Ok(new { selectionId = selection.Id, isActive = selection.isActive });
        }

        [HttpGet("active-drinks")]
        public async Task<IActionResult> GetActiveSelectionDrinks()
        {
            var drinks = await _context.Selections
                .Where(s => s.isActive)
                .Include(s => s.Drinks)
                .SelectMany(s => s.Drinks)
                .Distinct()
                .Select(d => new DrinkDTO
                {
                    Name = d.Name,
                    ImagePath = d.ImagePath
                })
                .ToListAsync();

            return Ok(drinks);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSelection(int id)
        {
            var selection = await _context.Selections.FindAsync(id);
            if (selection == null)
            {
                return NotFound("Selection not found.");
            }

            _context.Selections.Remove(selection);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Selection deleted successfully." });
        }
    }
}
