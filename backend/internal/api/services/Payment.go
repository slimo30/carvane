package services

import (
    "caravane/backend/internal/api/models"
    "caravane/backend/internal/database"
)

func CreatePayment(payment *models.Payment) error {
    return database.DB.Create(payment).Error
}

func GetPaymentByOrder(orderID uint) (models.Payment, error) {
    var payment models.Payment
    err := database.DB.Where("order_id = ?", orderID).First(&payment).Error
    return payment, err
}
