package services

import (
    "caravane/backend/internal/api/models"
    "caravane/backend/internal/database"
)

func CreateMenu(menu *models.Menu) error {
    return database.DB.Create(menu).Error
}

func GetMenusByRestaurant(restaurantID uint) ([]models.Menu, error) {
    var menus []models.Menu
    err := database.DB.Where("restaurant_id = ?", restaurantID).Find(&menus).Error
    return menus, err
}
