namespace Aegir.Quote.Controllers
{
    using Inda.Rp.Filters;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Security.Claims;

    public class HomeController : Controller
    {
        [Authorize]
        [ClaimRequired(ClaimTypes.Role, "I47P")]
        [HttpGet("/")]
        [ResponseCache(Duration = 360000)]
        public IActionResult Board() => View();

        [HttpGet("/Account/AccessDenied")]
        public IActionResult Edit() => Ok("\n\n\n\t\tYou do not appear to have access to this resource.\n\n\t\tIf this appears to be a mistake, please contact your relationship manager at i47.");
    }
}