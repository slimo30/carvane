package models

import "gorm.io/gorm"

type Restaurant struct {
	gorm.Model
	Name        string
	Description string
	Image       string
	Price       float64
}
