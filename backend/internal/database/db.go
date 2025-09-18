package database

import (
	"caravane/backend/internal/api/models"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// Try to load .env file, but don't fail if it doesn't exist
	godotenv.Load(".env")

	// Get database configuration from environment variables
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "user"
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "password"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "poli_db"
	}

	// Build PostgreSQL DSN
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Erreur de connexion à la base de données PostgreSQL :", err)
	}

	modelsToMigrate := []interface{}{
		&models.User{},
		&models.Restaurant{},
		&models.Notif{},
	}
	for _, model := range modelsToMigrate {
		if err := DB.AutoMigrate(model); err != nil {
			log.Printf("⚠️ Erreur migration pour %T : %v", model, err)
		} else {
			log.Printf("✅ Table migrée : %T", model)
		}
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Erreur lors de l'accès à la connexion SQL :", err)
	}

	err = sqlDB.Ping()
	if err != nil {
		log.Fatal("Impossible de se connecter à la base de données :", err)
	}

	fmt.Println("Connexion à la base de données PostgreSQL réussie.")
}

// GetDB retourne la connexion à la base de données
func GetDB() *gorm.DB {
	return DB
}

// CloseDB ferme la connexion à la base de données
func CloseDB() {
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Erreur lors de la fermeture de la base de données:", err)
	}
	sqlDB.Close()
}
