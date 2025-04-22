using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoctailDebucle.Server.Data;
using CoctailDebucle.Server.Models;

// using Entity Framework and dependency injection with a DbContext
namespace CoctailDebucle.Server.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("{userId}/favorites/{drinkId}")]
        public async Task<IActionResult> AddFavoriteDrink(int userId, int drinkId)
        {
            var user = await _context.Users.FindAsync(userId);
            var drink = await _context.Drinks.FindAsync(drinkId);

            if (user == null || drink == null)
            {
                return NotFound("User or Drink not found.");
            }
            // Check if the drink is already in favorites
            if (_context.UserFavoriteDrinks.Any(ufd => ufd.UserId == userId && ufd.DrinkId == drinkId))
            {
                return BadRequest("Drink is already a favorite.");
            }

            var favorite = new UserFavoriteDrink { UserId = userId, DrinkId = drinkId };
            _context.UserFavoriteDrinks.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok("Drink added to favorites.");
        }

        [HttpGet("{userId}/favorites")]
        public async Task<IActionResult> GetFavoriteDrinks(int userId)
        {
            var favorites = await _context.UserFavoriteDrinks
                .Where(ufd => ufd.UserId == userId)
                .Include(ufd => ufd.Drink)
                .Select(ufd => new
                {
                    ufd.Drink.Id,
                    ufd.Drink.Name,
                    ufd.Drink.Category,
                    ufd.Drink.Instructions,
                    ufd.Drink.ImagePath
                })
                .ToListAsync();

            return Ok(favorites);
        }

        [HttpDelete("{userId}/favorites/{drinkId}")]
        public async Task<IActionResult> RemoveFavoriteDrink(int userId, int drinkId)
        {
            var favorite = await _context.UserFavoriteDrinks
                .FirstOrDefaultAsync(ufd => ufd.UserId == userId && ufd.DrinkId == drinkId);

            if (favorite == null)
            {
                return NotFound("Favorite drink not found.");
            }

            _context.UserFavoriteDrinks.Remove(favorite);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{userId}/consent")]
        public async Task<IActionResult> UpdateGdprConsent(int userId, [FromBody] bool consentGiven)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.GdprConsent = consentGiven;
            await _context.SaveChangesAsync();

            return Ok(new { message = "GDPR consent updated successfully." });
        }

        [HttpGet("{userId}/consent")]
        public async Task<IActionResult> GetConsent(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found.");

            return Ok(new { gdprConsent = user.GdprConsent });
        }

        [HttpDelete("{userId}/consent")]
        public async Task<IActionResult> WithdrawConsent(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found.");

            user.GdprConsent = false;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("role/{userId}")]
        public async Task<IActionResult> UpdateUserRole(int userId, [FromBody] UserRole newRole)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Role = newRole;
            await _context.SaveChangesAsync();

            return Ok($"User {user.Username}'s role updated to {newRole}");
        }
    }
}
