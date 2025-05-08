using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

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

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();

// Ideally ensures that files are served correctly
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowAngularApp");

app.UseAuthorization();
app.MapControllers();
app.Run();
