using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CocktailController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public CocktailController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpGet]
    public async Task<IActionResult> GetDrinks()
    {
        var response = await _httpClient.GetStringAsync("https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink");
        return Ok(response);
    }
}
