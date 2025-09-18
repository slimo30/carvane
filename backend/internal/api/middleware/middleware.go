package middleware

import (
	"caravane/backend/internal/api/models"
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var JwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

type contextKey string

const userContextKey = contextKey("user")

func JwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Exclure les routes de documentation Swagger et health check
		if r.URL.Path == "/login" || r.URL.Path == "/submit" || r.URL.Path == "/" ||
			r.URL.Path == "/health" || strings.HasPrefix(r.URL.Path, "/docs/") {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing or invalid Authorization header", http.StatusUnauthorized)
			return
		}
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "lol", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &models.Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return JwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Injecter les claims dans le contexte
		ctx := context.WithValue(r.Context(), "user", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func IsAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value("user").(*models.Claims)
		if !ok {
			http.Error(w, "Erreur de récupération des claims", http.StatusInternalServerError)
			return
		}

		// Vérifie si l'utilisateur est un admin
		if claims.Role != "SuperAdmin" {
			http.Error(w, "Accès refusé : Vous n'êtes pas autorisé", http.StatusForbidden)
			return
		}

		// Si l'utilisateur est admin, appelle le handler suivant
		next.ServeHTTP(w, r)
	})
}
