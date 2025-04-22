using CoctailDebucle.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;
using CoctailDebucle.Server.Models;


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
    }
}
