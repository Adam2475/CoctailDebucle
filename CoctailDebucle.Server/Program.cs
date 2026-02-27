using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

// application startup code

var builder = WebApplication.CreateBuilder(args);

// Set up the DbContext with SQL Server connection and added loggers

// setting the command timeout for the database

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.CommandTimeout(0))
    // 0 for no timeout
    .EnableSensitiveDataLogging()
    .LogTo(Console.WriteLine, LogLevel.Information)
);

// Add MVC controllers
builder.Services.AddControllers();
builder.Services.AddHttpClient();

// Set up CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Add Swagger services
builder.Services.AddSwaggerGen();

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});


// JSON serializer settings
builder.Services.AddControllersWithViews().AddNewtonsoftJson();
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

var disableHttpsRedirection = builder.Configuration.GetValue<bool>("DisableHttpsRedirection");

app.UseSwagger();
app.UseSwaggerUI();
if (!disableHttpsRedirection)
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowAngularApp");

app.UseAuthorization();
app.MapControllers();
app.Run();
