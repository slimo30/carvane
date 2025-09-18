package models

import "gorm.io/gorm"

type Menu struct {
    gorm.Model
    Name        string   `json:"name"`
    Description string   `json:"description"`
    Price       float64  `json:"price"`
    RestaurantID uint    `json:"restaurant_id"`
    Restaurant  Restaurant `gorm:"foreignKey:RestaurantID"`
}
