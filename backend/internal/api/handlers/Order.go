package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"

    "caravane/backend/internal/api/models"
    "caravane/backend/internal/api/services"
    "github.com/gorilla/mux"
)

func CreateOrderHandler(w http.ResponseWriter, r *http.Request) {
    var order models.Order
    if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if err := services.CreateOrder(&order); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(order)
}

func UpdateOrderStatusHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, _ := strconv.Atoi(vars["orderID"])
    var payload struct {
        Status string `json:"status"`
    }
    json.NewDecoder(r.Body).Decode(&payload)

    if err := services.UpdateOrderStatus(uint(id), payload.Status); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "status updated"})
}
