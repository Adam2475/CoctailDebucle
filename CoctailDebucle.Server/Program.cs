var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// JSON serializer settings
builder.Services.AddControllersWithViews().AddNewtonsoftJson();

var app = builder.Build();

// Enable CORS
// In production you need to enable only trusted origins
app.UseCors(x=>x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

app.UseCors("AllowAngularApp");

app.UseAuthorization();
app.MapControllers();
app.Run();
