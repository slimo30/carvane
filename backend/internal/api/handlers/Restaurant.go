package handlers

import (
	"caravane/backend/internal/api/models"
	"caravane/backend/internal/database"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GetAllRestaurants godoc
// @Summary Récupérer tous les restaurants
// @Description Retourne la liste de tous les restaurants
// @Tags restaurants
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Restaurant
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/restaurants [get]
func GetAllRestaurants(w http.ResponseWriter, r *http.Request) {
	var restaurants []models.Restaurant
	db := database.GetDB()

	if err := db.Find(&restaurants).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(restaurants)
}

// GetRestaurant godoc
// @Summary Récupérer un restaurant par ID
// @Description Retourne les détails d'un restaurant spécifique
// @Tags restaurants
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID du restaurant"
// @Success 200 {object} models.Restaurant
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/restaurants/{id} [get]
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

// CreateRestaurant godoc
// @Summary Créer un nouveau restaurant
// @Description Crée un nouveau restaurant dans le système
// @Tags restaurants
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param restaurant body models.Restaurant true "Données du restaurant"
// @Success 201 {object} models.Restaurant
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/restaurants [post]
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

// UpdateRestaurant godoc
// @Summary Mettre à jour un restaurant
// @Description Met à jour les informations d'un restaurant existant
// @Tags restaurants
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID du restaurant"
// @Param restaurant body models.Restaurant true "Données mises à jour du restaurant"
// @Success 200 {object} models.Restaurant
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/restaurants/{id} [put]
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

// DeleteRestaurant godoc
// @Summary Supprimer un restaurant
// @Description Supprime un restaurant du système
// @Tags restaurants
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID du restaurant"
// @Success 204 "Restaurant supprimé avec succès"
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/restaurants/{id} [delete]
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
