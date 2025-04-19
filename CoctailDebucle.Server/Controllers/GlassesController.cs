using CoctailDebucle.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace CoctailDebucle.Server.Controllers
{
    [ApiController]
    [Route("api/drinkDb/glasses")]
    [EnableCors("AllowAngularApp")]
    public class GlassesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GlassesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SaveGlasses([FromBody] List<NameDto> glasses)
        {
            foreach (var dto in glasses)
            {
                var exists = await _context.Glasses
                    .AnyAsync(g => g.Name.ToLower() == dto.Name.ToLower());
                if (!_context.Glasses.Any(g => g.Name == dto.Name))
                {
                    _context.Glasses.Add(new Glass { Name = dto.Name });
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
