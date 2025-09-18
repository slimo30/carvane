package handlers

import (
	"caravane/backend/internal/api/models"
	"caravane/backend/internal/database"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GetAllAdmins godoc
// @Summary Récupérer tous les administrateurs
// @Description Retourne la liste de tous les administrateurs de restaurant
// @Tags admins
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.User
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/admins [get]
func GetAllAdmins(w http.ResponseWriter, r *http.Request) {
	var admins []models.User
	db := database.GetDB()

	if err := db.Where("role = ?", "admin_restaurant").Find(&admins).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(admins)
}

// GetAdmin godoc
// @Summary Récupérer un administrateur par ID
// @Description Retourne les détails d'un administrateur spécifique
// @Tags admins
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de l'administrateur"
// @Success 200 {object} models.User
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/admins/{id} [get]
func GetAdmin(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var admin models.User
	db := database.GetDB()

	if err := db.Where("role = ?", "admin_restaurant").First(&admin, id).Error; err != nil {
		http.Error(w, "Admin non trouvé", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(admin)
}

// CreateAdmin godoc
// @Summary Créer un nouvel administrateur
// @Description Crée un nouvel administrateur de restaurant
// @Tags admins
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param admin body models.User true "Données de l'administrateur"
// @Success 201 {object} models.User
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/admins [post]
func CreateAdmin(w http.ResponseWriter, r *http.Request) {
	var admin models.User
	if err := json.NewDecoder(r.Body).Decode(&admin); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	admin.Role = "AdminRestaurant" // sécurité : on force le rôle

	db := database.GetDB()
	if err := db.Create(&admin).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(admin)
}

// UpdateAdmin godoc
// @Summary Mettre à jour un administrateur
// @Description Met à jour les informations d'un administrateur existant
// @Tags admins
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de l'administrateur"
// @Param admin body models.User true "Données mises à jour de l'administrateur"
// @Success 200 {object} models.User
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/admins/{id} [put]
func UpdateAdmin(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var admin models.User
	db := database.GetDB()

	if err := db.Where("role = ?", "admin_restaurant").First(&admin, id).Error; err != nil {
		http.Error(w, "Admin non trouvé", http.StatusNotFound)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&admin); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	admin.Role = "admin_restaurant" // on s’assure qu’il reste admin

	db.Save(&admin)
	json.NewEncoder(w).Encode(admin)
}

// DeleteAdmin godoc
// @Summary Supprimer un administrateur
// @Description Supprime un administrateur du système
// @Tags admins
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de l'administrateur"
// @Success 204 "Administrateur supprimé avec succès"
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/admins/{id} [delete]
func DeleteAdmin(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	db := database.GetDB()
	if err := db.Where("role = ?", "admin_restaurant").Delete(&models.User{}, id).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
