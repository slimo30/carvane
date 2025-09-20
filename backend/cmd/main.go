package main

import (
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

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // Port par défaut localement
	}

	fmt.Printf("Server starting on port %s\n", port)
	err := http.ListenAndServe(":"+port, app)
	if err != nil {
		log.Fatal(err)
	}
}
