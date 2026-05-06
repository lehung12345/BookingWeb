using Bookingweb.Models;
using Bookingweb.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using Npgsql;
using Bookingweb.Enums;
using dotenv.net;

DotEnv.Load(); // Tải biến môi trường từ file .env

var builder = WebApplication.CreateBuilder(args);

NpgsqlConnection.GlobalTypeMapper.MapEnum<UserRole>("user_role");
NpgsqlConnection.GlobalTypeMapper.MapEnum<AppointmentStatus>("appointment_status");

// 1. Cấu hình Database (PostgreSQL)
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION") 
                      ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Cấu hình JWT Authentication
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? throw new InvalidOperationException("JWT_KEY not found in environment variables.");
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "BookingWeb";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "BookingWebUser";

var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// 3. CORS - cho phép React frontend gọi API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:3000";
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 4. Đăng ký các dịch vụ
builder.Services.AddAuthorization();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<DoctorService>();
builder.Services.AddScoped<ScheduleService>();
builder.Services.AddScoped<AppointmentService>();
builder.Services.AddScoped<SpecialtyService>();
builder.Services.AddScoped<AdminService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- KẾT THÚC PHẦN ĐĂNG KÝ SERVICES ---
var app = builder.Build();

// 5. Cấu hình HTTP request pipeline (Middleware)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔥 CORS phải đặt trước Authentication
app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Execute raw SQL to ensure Postgres enum has the new values
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.ExecuteSqlRaw("ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'SCHEDULED';");
        context.Database.ExecuteSqlRaw("ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'PATIENT_CONFIRMED';");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Could not update appointment_status enum: {ex.Message}");
    }
}

app.Run();