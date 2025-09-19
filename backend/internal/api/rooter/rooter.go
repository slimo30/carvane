package rooter

import (
	"caravane/backend/internal/api/handlers"
	"caravane/backend/internal/api/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	router := mux.NewRouter()

	// Health check endpoint (no authentication required)
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Auth endpoints (public): login/logout set/clear cookie
	router.HandleFunc("/login", handlers.Login).Methods("POST")
	router.HandleFunc("/logout", handlers.Logout).Methods("POST")

	// Appliquer le middleware JWT à toutes les routes
	router.Use(middleware.JwtMiddleware)

	// Routes protégées par JWT et rôle admin pour les utilisateurs
	r := router.PathPrefix("/SuperAdmin").Subrouter()
	r.Use(middleware.IsAdmin)
	r.HandleFunc("/restaurants", handlers.GetAllRestaurants).Methods("GET")
	r.HandleFunc("/restaurants/{id}", handlers.GetRestaurant).Methods("GET")
	r.HandleFunc("/restaurants", handlers.CreateRestaurant).Methods("POST")
	r.HandleFunc("/restaurants/{id}", handlers.UpdateRestaurant).Methods("PUT")
	r.HandleFunc("/restaurants/{id}", handlers.DeleteRestaurant).Methods("DELETE")
	r.HandleFunc("/admins", handlers.GetAllAdmins).Methods("GET")
	r.HandleFunc("/admins/{id}", handlers.GetAdmin).Methods("GET")
	r.HandleFunc("/admins", handlers.CreateAdmin).Methods("POST")
	r.HandleFunc("/admins/{id}", handlers.UpdateAdmin).Methods("PUT")
	r.HandleFunc("/admins/{id}", handlers.DeleteAdmin).Methods("DELETE")

	// Routes pour les notifications
	r.HandleFunc("/notifications", handlers.GetNotifications).Methods("GET")
	r.HandleFunc("/notifications/{id}", handlers.GetNotification).Methods("GET")
	r.HandleFunc("/notifications", handlers.CreateNotification).Methods("POST")
	r.HandleFunc("/notifications/{id}", handlers.UpdateNotification).Methods("PUT")
	r.HandleFunc("/notifications/{id}", handlers.DeleteNotification).Methods("DELETE")
	r.HandleFunc("/notifications/{id}/read", handlers.MarkNotificationAsRead).Methods("PATCH")

	return router
}
