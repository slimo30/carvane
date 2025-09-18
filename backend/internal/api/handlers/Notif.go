package handlers

import (
	"caravane/backend/internal/api/models"
	"caravane/backend/internal/database"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GetNotifications godoc
// @Summary Récupérer toutes les notifications
// @Description Retourne la liste de toutes les notifications
// @Tags notifications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Notif
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/notifications [get]
func GetNotifications(w http.ResponseWriter, r *http.Request) {
	db := database.GetDB()

	var notifs []models.Notif
	err := db.Order("created_at desc").Find(&notifs).Error
	if err != nil {
		http.Error(w, "Erreur lors de la récupération des notifications", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(notifs); err != nil {
		http.Error(w, "Erreur lors de l'envoi des données", http.StatusInternalServerError)
		return
	}
}

// GetNotification godoc
// @Summary Récupérer une notification par ID
// @Description Retourne les détails d'une notification spécifique
// @Tags notifications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de la notification"
// @Success 200 {object} models.Notif
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/notifications/{id} [get]
func GetNotification(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var notif models.Notif
	db := database.GetDB()

	if err := db.First(&notif, id).Error; err != nil {
		http.Error(w, "Notification non trouvée", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(notif)
}

// CreateNotification godoc
// @Summary Créer une nouvelle notification
// @Description Crée une nouvelle notification dans le système
// @Tags notifications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param notification body models.Notif true "Données de la notification"
// @Success 201 {object} models.Notif
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/notifications [post]
func CreateNotification(w http.ResponseWriter, r *http.Request) {
	var notif models.Notif
	if err := json.NewDecoder(r.Body).Decode(&notif); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db := database.GetDB()
	if err := db.Create(&notif).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(notif)
}

// UpdateNotification godoc
// @Summary Mettre à jour une notification
// @Description Met à jour les informations d'une notification existante
// @Tags notifications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de la notification"
// @Param notification body models.Notif true "Données mises à jour de la notification"
// @Success 200 {object} models.Notif
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/notifications/{id} [put]
func UpdateNotification(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var notif models.Notif
	db := database.GetDB()

	if err := db.First(&notif, id).Error; err != nil {
		http.Error(w, "Notification non trouvée", http.StatusNotFound)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&notif); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db.Save(&notif)
	json.NewEncoder(w).Encode(notif)
}

// DeleteNotification godoc
// @Summary Supprimer une notification
// @Description Supprime une notification du système
// @Tags notifications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de la notification"
// @Success 204 "Notification supprimée avec succès"
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/notifications/{id} [delete]
func DeleteNotification(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	db := database.GetDB()
	if err := db.Delete(&models.Notif{}, id).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// MarkNotificationAsRead godoc
// @Summary Marquer une notification comme lue
// @Description Marque une notification comme lue
// @Tags notifications
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "ID de la notification"
// @Success 200 {object} models.Notif
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /SuperAdmin/notifications/{id}/read [patch]
func MarkNotificationAsRead(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var notif models.Notif
	db := database.GetDB()

	if err := db.First(&notif, id).Error; err != nil {
		http.Error(w, "Notification non trouvée", http.StatusNotFound)
		return
	}

	notif.IsRead = true
	db.Save(&notif)

	json.NewEncoder(w).Encode(notif)
}
