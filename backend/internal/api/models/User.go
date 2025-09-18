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
	Username string
	Email    string
	Password string
	Role     Role
}
