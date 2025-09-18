package main

import (
	"caravane/backend/internal/api/middleware"
	"caravane/backend/internal/api/rooter"
	"caravane/backend/internal/database"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	database.InitDB()
	app := rooter.NewRouter()
	app.Use(middleware.JwtMiddleware)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // Port par défaut localement
	}

	fmt.Println("http://localhost:8080")
	err := http.ListenAndServe(":"+port, app)
	if err != nil {
		log.Fatal(err)
	}
}
