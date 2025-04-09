using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Set up the DbContext with SQL Server connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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
//builder.Services.AddEndpointsApiExplorer();
//Configure Swagger
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
