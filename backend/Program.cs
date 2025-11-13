using Backend;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddHttpClient();
builder.Services.AddDbContext<DataContext>(opt => opt.UseInMemoryDatabase("ChatDb"));

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();
