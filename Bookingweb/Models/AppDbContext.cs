using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Bookingweb.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<appointment> appointments { get; set; }

    public virtual DbSet<doctor> doctors { get; set; }

    public virtual DbSet<schedule> schedules { get; set; }

    public virtual DbSet<specialty> specialties { get; set; }

    public virtual DbSet<user> users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresEnum<Bookingweb.Enums.UserRole>();
        modelBuilder.HasPostgresEnum<Bookingweb.Enums.AppointmentStatus>();


        modelBuilder.Entity<appointment>(entity =>
        {
            entity.HasKey(e => e.id).HasName("appointments_pkey");

            entity.HasIndex(e => e.doctor_id, "idx_appointment_doctor");

            entity.HasIndex(e => e.user_id, "idx_appointment_user");

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.doctor).WithMany(p => p.appointments)
                .HasForeignKey(d => d.doctor_id)
                .HasConstraintName("fk_appointment_doctor");

            entity.HasOne(d => d.schedule).WithMany(p => p.appointments)
                .HasForeignKey(d => d.schedule_id)
                .HasConstraintName("fk_appointment_schedule");

            entity.HasOne(d => d.user).WithMany(p => p.appointments)
                .HasForeignKey(d => d.user_id)
                .HasConstraintName("fk_appointment_user");
            entity.Property(e => e.Status)
                .HasColumnName("status");
        });

        modelBuilder.Entity<doctor>(entity =>
        {
            entity.HasKey(e => e.id).HasName("doctors_pkey");

            entity.HasIndex(e => e.user_id, "doctors_user_id_key").IsUnique();

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.experience_years).HasDefaultValue(0);

            entity.HasOne(d => d.specialty).WithMany(p => p.doctors)
                .HasForeignKey(d => d.specialty_id)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_doctor_specialty");

            entity.HasOne(d => d.user).WithOne(p => p.doctor)
                .HasForeignKey<doctor>(d => d.user_id)
                .HasConstraintName("fk_doctor_user");
        });

        modelBuilder.Entity<schedule>(entity =>
        {
            entity.HasKey(e => e.id).HasName("schedules_pkey");

            entity.HasIndex(e => e.doctor_id, "idx_schedule_doctor");

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");

            entity.HasOne(d => d.doctor).WithMany(p => p.schedules)
                .HasForeignKey(d => d.doctor_id)
                .HasConstraintName("fk_schedule_doctor");
        });

        modelBuilder.Entity<specialty>(entity =>
        {
            entity.HasKey(e => e.id).HasName("specialties_pkey");

            entity.HasIndex(e => e.name, "specialties_name_key").IsUnique();

            entity.Property(e => e.name).HasMaxLength(100);
        });

        modelBuilder.Entity<user>(entity =>
        {
            entity.HasKey(e => e.id).HasName("users_pkey");

            entity.HasIndex(e => e.email, "idx_users_email");

            entity.HasIndex(e => e.email, "users_email_key").IsUnique();

            entity.Property(e => e.id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone");
            entity.Property(e => e.email).HasMaxLength(150);
            entity.Property(e => e.full_name).HasMaxLength(100);
            entity.Property(e => e.password).HasMaxLength(255);
            entity.Property(e => e.phone).HasMaxLength(20);
            entity.Property(e => e.Role)
                .HasColumnName("role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
