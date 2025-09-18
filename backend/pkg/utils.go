package utils

import (
	"caravane/backend/internal/api/models"
	//"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"os"
	"regexp"
	"strings"
)

type Pagedata struct {
	Currentuser models.User
	Users       []models.User
}

func VerifyUser(db *gorm.DB, identifier, password string) (bool, models.User, string) {
	var user models.User
	if err := db.Where("email = ?", identifier).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, user, "User not found."
		}
		log.Println("GORM Error:", err)
		return false, user, "Database error."
	}
	// Vérifie le mot de passe
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return false, user, "Incorrect password."
	}

	return true, user, "User verified."
}

func ValidateInput(user models.User) (bool, string) {
	if user.Nom == "" || user.Prenom == "" || user.Password == "" || user.Role == "" || user.Email == "" || user.Numero == "" {
		return false, "All fields (nom, prenom, email, password, role) are required."
	}
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
	if !emailRegex.MatchString(user.Email) {
		return false, "Invalid email format."
	}
	if len(user.Password) < 6 {
		return false, "Password must be at least 6 characters long."
	}
	if len(user.Numero) != 10 || user.Numero[0] != '0' {
		return false, "Phone number must be 10 digits long."
	}

	return true, ""
}
func sanitizeRole(role models.Role) models.Role {
	switch role {
	case models.SuperAdmin, models.AdminRestaurant, models.Normal:
		return models.Role(role) // Rôle valide
	default:
		// Retourne un rôle par défaut si le rôle est invalide
		return models.Normal
	}
}

func SanitizeInput(user *models.User) {
	re := regexp.MustCompile("<.*?>")

	user.Nom = clean(user.Nom, re)
	user.Prenom = clean(user.Prenom, re)
	user.Password = clean(user.Password, re)
	user.Email = clean(user.Email, re)
	user.Numero = clean(user.Numero, re)
	user.Role = sanitizeRole(user.Role)
}

// clean supprime les balises HTML et les espaces inutiles
func clean(s string, re *regexp.Regexp) string {
	return re.ReplaceAllString(strings.TrimSpace(s), "")
}

var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))
