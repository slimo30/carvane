package handlers

import (
	"caravane/backend/internal/api/models"
	"caravane/backend/internal/database"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// / 📌 GET /admins → liste tous les admins restaurant
func GetAllAdmins(w http.ResponseWriter, r *http.Request) {
	var admins []models.User
	db := database.GetDB()

	if err := db.Where("role = ?", "admin_restaurant").Find(&admins).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(admins)
}

// / 📌 GET /admins/{id} → détail d’un admin restaurant
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

// / 📌 POST /admins → créer un nouvel admin restaurant
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

// / 📌 PUT /admins/{id} → mettre à jour un admin
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

// / 📌 DELETE /admins/{id} → supprimer un admin
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
