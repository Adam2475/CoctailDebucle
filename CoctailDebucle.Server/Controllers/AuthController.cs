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
using CoctailDebucle.Server.Models;
using Microsoft.Extensions.Logging;
using CoctailDebucle.Server.DTOs;
using System.Diagnostics;

// MVC : Model - View - Controller
namespace CoctailDebucle.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //private IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly ILogger<UserController> _logger;
        public AuthController(AppDbContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                // Check if username already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);

                if (existingUser != null)
                {
                    return BadRequest("Username is already taken.");
                }

                // Create a new user
                var user = new User
                {
                    Username = model.Username,
                    Email = model.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                    Name = model.Name,
                    Surname = model.Surname,
                    BirthDate = model.BirthDate,
                };

                // Save user to the database
                _context.Users.Add(user);
                await _context.SaveChangesAsync(); // error line

                return Ok(new { message = "Registration successful" });
            }

            return BadRequest("Invalid registration data.");
        }

        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UpdateUserDto dto)
        {
            /*
            Debug.WriteLine("DTO ricevuto:");
            Debug.WriteLine($"Username: {dto.Username}");
            Debug.WriteLine($"Email: {dto.Email}");
            Debug.WriteLine($"Password: {dto.Password}");
            Debug.WriteLine($"Name: {dto.Name}");
            Debug.WriteLine($"Surname: {dto.Surname}");
            Debug.WriteLine($"BirthDate: {dto.BirthDate}");
            */

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Username = dto.Username;
            user.Email = dto.Email;
            //ser.GdprConsent = dto.GdprConsent;   //mettere gdpr consent in modulo registrazione?
            user.Name = dto.Name;
            user.Surname = dto.Surname;
            user.BirthDate = dto.BirthDate;

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();

            return Ok("User updated successfully.");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                _logger.LogInformation("User not found with id: {Id}", id);
                return NotFound();
            }

            // Log the user data (avoid sensitive information)
            _logger.LogInformation("Retrieved user: {User}", user);
            return Ok(user);
        }

        // Login Endpoint
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel loginUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == loginUser.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginUser.Password, user.PasswordHash))
               return Unauthorized("Invalid credentials");
            // Create JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("YourSuperLongSecretKey@1234567890"); // Store in appsettings.json
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Username) }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            Console.WriteLine("User ID from controller: " + user.Id);
            return Ok(new { Token = tokenHandler.WriteToken(token), UserId = user.Id });
        }
    }
}
