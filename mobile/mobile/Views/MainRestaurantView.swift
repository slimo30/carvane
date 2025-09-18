//
//  MainRestaurantView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct MainRestaurantView: View {
    @EnvironmentObject var appStateManager: AppStateManager
    @State private var showQRScanner = false
    @State private var showMenu = false
    @State private var tableNumber = ""
    @State private var showProfile = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 40) {
                // Header with user info and logout
                HStack {
                    VStack(alignment: .leading) {
                        Text("Bonjour!")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.primary)
                        
                        Text("Prêt à commander?")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    // Profile button
                    Button(action: {
                        showProfile = true
                    }) {
                        Image(systemName: "person.circle.fill")
                            .font(.title2)
                            .foregroundColor(.orange)
                    }
                }
                .padding(.horizontal)
                .padding(.top)
                
                // Main content
                VStack(spacing: 30) {
                    // App logo and title
                    VStack(spacing: 16) {
                        Image(systemName: "fork.knife.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.orange)
                        
                        Text("Caravane")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.primary)
                        
                        Text("Restaurant Digital")
                            .font(.title2)
                            .foregroundColor(.secondary)
                    }
                    
                    // Features showcase
                    VStack(spacing: 20) {
                        Text("Choisissez votre action")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        VStack(spacing: 16) {
                            MainFeatureRow(
                                icon: "qrcode.viewfinder",
                                title: "Scanner QR Code",
                                description: "Commencez votre commande",
                                color: Color.blue,
                                action: {
                                    showQRScanner = true
                                }
                            )
                            
                            MainFeatureRow(
                                icon: "menucard",
                                title: "Voir le Menu",
                                description: "Parcourez nos plats",
                                color: Color.green,
                                action: {
                                    // For demo, use table 1
                                    tableNumber = "1"
                                    showMenu = true
                                }
                            )
                            
                            MainFeatureRow(
                                icon: "mic.circle.fill",
                                title: "Assistant Vocal",
                                description: "Posez vos questions",
                                color: Color.purple,
                                action: {
                                    // For demo, use table 1
                                    tableNumber = "1"
                                    showMenu = true
                                }
                            )
                        }
                    }
                    .padding(.horizontal)
                }
                
                Spacer()
                
                // Quick start button
                Button(action: {
                    showQRScanner = true
                }) {
                    HStack {
                        Image(systemName: "qrcode.viewfinder")
                        Text("Commencer ma commande")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.orange)
                    .cornerRadius(12)
                }
                .padding(.horizontal)
                .padding(.bottom, 40)
            }
        }
        .sheet(isPresented: $showQRScanner) {
            QRScannerView(
                isPresented: $showQRScanner,
                onTableScanned: { table in
                    tableNumber = table
                    showMenu = true
                }
            )
        }
        .sheet(isPresented: $showMenu) {
            if !tableNumber.isEmpty {
                MenuView(tableNumber: tableNumber)
            }
        }
        .sheet(isPresented: $showProfile) {
            ProfileView()
        }
    }
}

struct MainFeatureRow: View {
    let icon: String
    let title: String
    let description: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                    .frame(width: 30)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    Text(description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .foregroundColor(.gray)
                    .font(.caption)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ProfileView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var appStateManager: AppStateManager
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                // Profile header
                VStack(spacing: 16) {
                    Image(systemName: "person.circle.fill")
                        .font(.system(size: 80))
                        .foregroundColor(.orange)
                    
                    Text("Profil")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text(UserDefaults.standard.string(forKey: "userEmail") ?? "Guest")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding()
                
                // Profile options
                VStack(spacing: 16) {
                    ProfileOptionRow(
                        icon: "person.fill",
                        title: "Informations personnelles",
                        action: {}
                    )
                    
                    ProfileOptionRow(
                        icon: "clock.fill",
                        title: "Historique des commandes",
                        action: {}
                    )
                    
                    ProfileOptionRow(
                        icon: "heart.fill",
                        title: "Favoris",
                        action: {}
                    )
                    
                    ProfileOptionRow(
                        icon: "gear",
                        title: "Paramètres",
                        action: {}
                    )
                }
                .padding(.horizontal)
                
                Spacer()
                
                // Logout button
                Button(action: {
                    appStateManager.logout()
                }) {
                    HStack {
                        Image(systemName: "power")
                        Text("Se déconnecter")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .cornerRadius(12)
                }
                .padding(.horizontal)
                .padding(.bottom, 40)
            }
            .navigationTitle("Profil")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct ProfileOptionRow: View {
    let icon: String
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(.orange)
                    .frame(width: 24)
                
                Text(title)
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .foregroundColor(.gray)
                    .font(.caption)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

#Preview {
    MainRestaurantView()
        .environmentObject(AppStateManager())
}
