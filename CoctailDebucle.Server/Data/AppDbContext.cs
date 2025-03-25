using Microsoft.EntityFrameworkCore;

namespace CoctailDebucle.Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    // Define primary key for the User entity
        //    modelBuilder.Entity<User>().HasKey(u => u.Id);

        //    base.OnModelCreating(modelBuilder);
        //}
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