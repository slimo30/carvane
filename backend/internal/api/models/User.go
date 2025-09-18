package models

import (
	"gorm.io/gorm"
)

type Role string

const (
	SuperAdmin      Role = "SuperAdmin"
	AdminRestaurant Role = "AdminRestaurant"
	Normal          Role = "User"
)

type User struct {
	gorm.Model
	ID       uint   `gorm:"primaryKey"`
	Nom      string `gorm:"not null" json:"nom"`
	Prenom   string `gorm:"not null" json:"prenom"`
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `gorm:"not null" json:"password"`
	Numero   string `gorm:"not null" json:"numero"`
	Code     string `gorm:"not null" json:"code"`
	Role     Role   `gorm:"type:text;default:'Enseignant';not null" json:"role"`
}
