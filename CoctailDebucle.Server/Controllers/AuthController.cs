using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.AspNetCore.Http;
using System.Data;
using System.Data.SqlClient;
using CoctailDebucle.Server.Data;
using Microsoft.IdentityModel.Tokens;
//using Microsoft.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;

// MVC : Model - View - Controller
namespace CoctailDebucle.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //private IConfiguration _configuration;
        private readonly AppDbContext _context;
        public AuthController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("register")]

        // Registration Endpoint
        //public async Task<IActionResult> Register ([FromBody] User user)
        //{
        //    if (_context.Users.Any(u=>u.Username == user.Username))
        //            return BadRequest("Username already exists");
        //    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
        //    _context.Users.Add(user);
        //    await _context.SaveChangesAsync();
        //    return Ok("User Registered Suuccessfully!");
        //}
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                // Check if username already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == model.Username);
                if (existingUser != null)
                {
                    return BadRequest("Username is already taken.");
                }

                // Create a new user
                var user = new User
                {
                    Username = model.Username,
                    Email = model.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password)
                };

                // Save user to the database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Registration successful" });
            }

            return BadRequest("Invalid registration data.");
        }

        // Login Endpoint
        [HttpGet("login")]
        public IActionResult Login([FromBody] User loginUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == loginUser.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginUser.PasswordHash, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("Your_Secret_Key_123"); // Store in appsettings.json
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Username) }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new { Token = tokenHandler.WriteToken(token) });
        }
    }
}
