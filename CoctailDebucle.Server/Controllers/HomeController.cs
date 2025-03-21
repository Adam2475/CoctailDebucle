using Microsoft.AspNetCore.Mvc;

namespace CoctailDebucle.Server.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
