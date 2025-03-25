using CoctailDebucle.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CoctailDebucle.Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
