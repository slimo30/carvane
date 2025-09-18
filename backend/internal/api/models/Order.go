package models

import "gorm.io/gorm"

type Order struct {
    gorm.Model
    RestaurantID uint       `json:"restaurant_id"`
    Restaurant   Restaurant `gorm:"foreignKey:RestaurantID"`

    Items        []OrderItem `json:"items" gorm:"foreignKey:OrderID"`
    TotalAmount  float64     `json:"total_amount"`
    Status       string      `json:"status"` // pending, accepted, preparing, completed, cancelled
    PaymentID    *uint       `json:"payment_id"`
    Payment      *Payment    `gorm:"foreignKey:PaymentID"`
}

type OrderItem struct {
    gorm.Model
    OrderID uint  `json:"order_id"`
    MenuID  uint  `json:"menu_id"`
    Menu    Menu  `gorm:"foreignKey:MenuID"`
    Quantity int   `json:"quantity"`
    Price   float64 `json:"price"`
}
