package rooter

import (
	"caravane/backend/internal/api/handlers"
	"caravane/backend/internal/api/middleware"
	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
    router := mux.NewRouter()

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

    return router
}