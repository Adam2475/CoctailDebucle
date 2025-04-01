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

[Route("api/[controller]")]
[ApiController]
// Enabling Cross-Origin Resource Sharing in Program.cs
[EnableCors("AllowAngularApp")]

// I need to create an API endpoint to handle search requests
public class CocktailController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly AppDbContext _context;
    public CocktailController(HttpClient httpClient, AppDbContext context)
    {
        _httpClient = httpClient;
        _context = context;
    }
    // Get API drinkss
    [HttpGet]
    public async Task<IActionResult> GetDrinks([FromQuery] string name)
    {
        var url = string.IsNullOrEmpty(name)
            ? "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink"
            : $"https://www.thecocktaildb.com/api/json/v1/1/search.php?s={name}";  // Search endpoint

        var response = await _httpClient.GetStringAsync(url);
        return Ok(response);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchCocktailByName([FromQuery] string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest("Cocktail name is required.");
        }
        string apiUrl = $"https://www.thecocktaildb.com/api/json/v1/1/search.php?s={name}";
        var response = await _httpClient.GetStringAsync(apiUrl);
        return Ok(response);
    }
}