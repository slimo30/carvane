package models

import "gorm.io/gorm"

type Payment struct {
    gorm.Model
    OrderID   uint    `json:"order_id"`
    Order     Order   `gorm:"foreignKey:OrderID"`
    Amount    float64 `json:"amount"`
    Method    string  `json:"method"` // "card", "cash", "edahabia"
    Status    string  `json:"status"` // "pending", "paid", "failed"
    Reference string  `json:"reference"` // numéro transaction
}
