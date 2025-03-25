using System.ComponentModel.DataAnnotations;

namespace CoctailDebucle.Server
{
    public class LoginModel
    {
        //[Key]
        //public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
