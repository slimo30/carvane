package services

import (
    "caravane/backend/internal/api/models"
    "caravane/backend/internal/database"
)

func CreateOrder(order *models.Order) error {
    return database.DB.Create(order).Error
}

func UpdateOrderStatus(orderID uint, status string) error {
    return database.DB.Model(&models.Order{}).Where("id = ?", orderID).Update("status", status).Error
}

func GetOrdersByRestaurant(restaurantID uint) ([]models.Order, error) {
    var orders []models.Order
    err := database.DB.Preload("Items.Menu").Where("restaurant_id = ?", restaurantID).Find(&orders).Error
    return orders, err
}
