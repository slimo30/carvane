package handlers

import (
	"caravane/backend/internal/api/models"
	"caravane/backend/internal/database"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

// / 📌 GET /restaurants → liste tous les restaurants
func GetAllRestaurants(w http.ResponseWriter, r *http.Request) {
	var restaurants []models.Restaurant
	db := database.GetDB()

	if err := db.Find(&restaurants).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(restaurants)
}

// / 📌 GET /restaurants/{id} → un restaurant par ID
func GetRestaurant(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var restaurant models.Restaurant
	db := database.GetDB()

	if err := db.First(&restaurant, id).Error; err != nil {
		http.Error(w, "Restaurant non trouvé", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(restaurant)
}

// / 📌 POST /restaurants → créer un restaurant
func CreateRestaurant(w http.ResponseWriter, r *http.Request) {
	var restaurant models.Restaurant
	if err := json.NewDecoder(r.Body).Decode(&restaurant); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db := database.GetDB()
	if err := db.Create(&restaurant).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(restaurant)
}

// / 📌 PUT /restaurants/{id} → mettre à jour un restaurant
func UpdateRestaurant(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var restaurant models.Restaurant
	db := database.GetDB()

	if err := db.First(&restaurant, id).Error; err != nil {
		http.Error(w, "Restaurant non trouvé", http.StatusNotFound)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&restaurant); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db.Save(&restaurant)
	json.NewEncoder(w).Encode(restaurant)
}

// / 📌 DELETE /restaurants/{id} → supprimer un restaurant
func DeleteRestaurant(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	db := database.GetDB()
	if err := db.Delete(&models.Restaurant{}, id).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
