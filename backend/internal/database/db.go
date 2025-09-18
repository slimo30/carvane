package database

import (
	"caravane/backend/internal/api/models"
	"fmt"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"os"
)

var DB *gorm.DB

func InitDB() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Erreur de chargement du fichier .env :", err)
	}

	dsn := os.Getenv("DSN")
	if dsn == "" {
		log.Fatal("DSN non défini dans .env")
	}

	DB, err = gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Erreur de connexion à la base de données SQLite :", err)
	}

	modelsToMigrate := []interface{}{
		&models.User{},
		&models.Restaurant{},
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

	fmt.Println("Connexion à la base de données SQLite réussie.")
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
