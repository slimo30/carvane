package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"

    "caravane/backend/internal/api/models"
    "caravane/backend/internal/api/services"
    "github.com/gorilla/mux"
)

func CreateMenuHandler(w http.ResponseWriter, r *http.Request) {
    var menu models.Menu
    if err := json.NewDecoder(r.Body).Decode(&menu); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if err := services.CreateMenu(&menu); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(menu)
}

func GetMenusHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, _ := strconv.Atoi(vars["restaurantID"])

    menus, err := services.GetMenusByRestaurant(uint(id))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(menus)
}
