using Microsoft.AspNetCore.Mvc;
using CoctailDebucle.Server.Data;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using CoctailDebucle.Server.Models;
using CoctailDebucle.Server.DTOs;
using Microsoft.Extensions.Configuration;

// MCV : Model - Controller - View
namespace CoctailDebucle.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Database context Class
        /* represents a session with your database
            allows you to query and save data */
        // Inherits from DbContext from EF Core
        // handles: SELECT (FindAsync, FirstOrDefaultAsync, ...)
        //          INSERT (Add, SaveChangesAsync)
        //          UPDATE
        //          DELETE
        private readonly AppDbContext _context;
        private readonly ILogger<UserController> _logger;

        // injecting appsettings as configuration
        private readonly IConfiguration _configuration;

        // Default Constructor
        public AuthController(AppDbContext context, ILogger<UserController> logger, IConfiguration configuration)
        {
            _context = context; // Inject DB Context
            _logger = logger;
            _configuration = configuration;
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
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Prima di salvare:
            Console.WriteLine($"Aggiorno consenso GDPR a: {dto.GdprConsent}");


            user.Username = dto.Username;
            user.Email = dto.Email;
            user.GdprConsent = dto.GdprConsent;   //mettere gdpr consent in modulo registrazione?
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
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
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
