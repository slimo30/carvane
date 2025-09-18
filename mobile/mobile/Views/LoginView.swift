//
//  LoginView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var appStateManager: AppStateManager
    @State private var email = ""
    @State private var password = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var isLoading = false
    
    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                gradient: Gradient(colors: [Color.orange.opacity(0.1), Color.white]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 40) {
                    Spacer()
                    
                    // Logo and title
                    VStack(spacing: 20) {
                        Image(systemName: "fork.knife.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.orange)
                        
                        Text("Caravane")
                            .font(.system(size: 36, weight: .bold, design: .rounded))
                            .foregroundColor(.primary)
                        
                        Text("Connectez-vous pour commencer")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    
                    // Login form
                    VStack(spacing: 20) {
                        // Email field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Email")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            TextField("votre@email.com", text: $email)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                        }
                        
                        // Password field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Mot de passe")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            SecureField("Votre mot de passe", text: $password)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                        
                        // Login button
                        Button(action: {
                            login()
                        }) {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                        .scaleEffect(0.8)
                                } else {
                                    Image(systemName: "person.circle.fill")
                                }
                                Text("Se connecter")
                            }
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.orange)
                            .cornerRadius(12)
                        }
                        .disabled(isLoading || email.isEmpty || password.isEmpty)
                        
                        // Divider
                        HStack {
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(height: 1)
                            Text("ou")
                                .foregroundColor(.secondary)
                                .padding(.horizontal, 16)
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(height: 1)
                        }
                        
                        // Guest mode button
                        Button(action: {
                            guestLogin()
                        }) {
                            HStack {
                                Image(systemName: "person.badge.plus")
                                Text("Continuer en tant qu'invité")
                            }
                            .font(.headline)
                            .foregroundColor(.orange)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.orange.opacity(0.1))
                            .cornerRadius(12)
                        }
                        .disabled(isLoading)
                    }
                    .padding(.horizontal, 32)
                    
                    // Features preview
                    VStack(spacing: 16) {
                        Text("Découvrez nos fonctionnalités")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        LazyVGrid(columns: [
                            GridItem(.flexible()),
                            GridItem(.flexible())
                        ], spacing: 16) {
                            FeatureCard(
                                icon: "qrcode.viewfinder",
                                title: "QR Code",
                                color: .blue
                            )
                            
                            FeatureCard(
                                icon: "mic.circle.fill",
                                title: "Assistant",
                                color: .green
                            )
                            
                            FeatureCard(
                                icon: "person.2.fill",
                                title: "Partage",
                                color: .purple
                            )
                            
                            FeatureCard(
                                icon: "wave.3.right",
                                title: "NFC Pay",
                                color: .red
                            )
                        }
                    }
                    .padding(.horizontal, 32)
                    
                    Spacer()
                }
            }
        }
        .alert("Erreur de connexion", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
    }
    
    private func login() {
        isLoading = true
        
        // Simulate login process
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            // Simple validation for demo
            if email.contains("@") && password.count >= 6 {
                // Successful login
                UserDefaults.standard.set(email, forKey: "userEmail")
                appStateManager.login()
            } else {
                // Login failed
                alertMessage = "Email ou mot de passe invalide"
                showAlert = true
            }
            isLoading = false
        }
    }
    
    private func guestLogin() {
        isLoading = true
        
        // Simulate guest login
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            UserDefaults.standard.set("Guest", forKey: "userEmail")
            appStateManager.login()
            isLoading = false
        }
    }
}

struct FeatureCard: View {
    let icon: String
    let title: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
            
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.primary)
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(12)
    }
}

#Preview {
    LoginView()
}
