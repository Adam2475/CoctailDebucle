using Microsoft.EntityFrameworkCore;

namespace CoctailDebucle.Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}

//using CoctailDebucle.Server;
//using Microsoft.EntityFrameworkCore;
//using CoctailDebucle.Models;

//namespace CoctailDebucle.Server.Data
//{
//    public class ApplicationDbContext : DbContext
//    {
//        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

//        public DbSet<User> Users { get; set; }
//    }
//}