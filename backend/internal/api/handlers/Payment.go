package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"

    "caravane/backend/internal/api/models"
    "caravane/backend/internal/api/services"
    "github.com/gorilla/mux"
)

func CreatePaymentHandler(w http.ResponseWriter, r *http.Request) {
    var payment models.Payment
    if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if err := services.CreatePayment(&payment); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(payment)
}

func GetPaymentHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, _ := strconv.Atoi(vars["orderID"])

    payment, err := services.GetPaymentByOrder(uint(id))
    if err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }

    json.NewEncoder(w).Encode(payment)
}
