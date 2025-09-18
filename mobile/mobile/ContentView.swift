//
//  ContentView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct ContentView: View {
    @State private var showQRScanner = false
    @State private var showMenu = false
    @State private var showVoiceAgent = false
    @State private var showSplitBill = false
    @State private var showPayment = false
    @State private var tableNumber = ""
    
    var body: some View {
        VStack(spacing: 40) {
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
                FeatureRow(
                    icon: "qrcode.viewfinder",
                    title: "Commande QR",
                    description: "Scannez et commandez en un clic",
                    action: {
                        showQRScanner = true
                    }
                )
                
                FeatureRow(
                    icon: "mic.circle.fill",
                    title: "Assistant Vocal",
                    description: "Posez vos questions sur le menu",
                    action: {
                        showVoiceAgent = true
                    }
                )
                
                FeatureRow(
                    icon: "person.2.fill",
                    title: "Partage d'addition",
                    description: "Divisez l'addition automatiquement",
                    action: {
                        showSplitBill = true
                    }
                )
                
                FeatureRow(
                    icon: "wave.3.right",
                    title: "Paiement NFC",
                    description: "Payez en touchant votre téléphone",
                    action: {
                        showPayment = true
                    }
                )
            }
            .padding(.horizontal)
            
            Spacer()
            
            // Start button
            Button(action: {
                showQRScanner = true
            }) {
                HStack {
                    Image(systemName: "qrcode.viewfinder")
                    Text("Commencer")
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
        .padding()
        .sheet(isPresented: $showQRScanner) {
            QRScannerDemoView(isPresented: $showQRScanner)
        }
        .sheet(isPresented: $showMenu) {
            MenuDemoView(tableNumber: tableNumber)
        }
        .sheet(isPresented: $showVoiceAgent) {
            VoiceAgentDemoView()
        }
        .sheet(isPresented: $showSplitBill) {
            SplitBillDemoView()
        }
        .sheet(isPresented: $showPayment) {
            PaymentDemoView()
        }
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let description: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(.orange)
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

// Demo Views for testing redirection
struct QRScannerDemoView: View {
    @Binding var isPresented: Bool
    @State private var scannedTable = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                Image(systemName: "qrcode.viewfinder")
                    .font(.system(size: 100))
                    .foregroundColor(.blue)
                
                Text("Scanner QR Code")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Simulation du scanner QR")
                    .font(.title2)
                    .foregroundColor(.secondary)
                
                TextField("Numéro de table", text: $scannedTable)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()
                
                Button("Simuler Scan") {
                    isPresented = false
                }
                .font(.headline)
                .foregroundColor(.white)
                .padding()
                .background(Color.blue)
                .cornerRadius(12)
                
                Spacer()
            }
            .padding()
            .navigationTitle("QR Scanner")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        isPresented = false
                    }
                }
            }
        }
    }
}

struct MenuDemoView: View {
    let tableNumber: String
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Menu - Table \(tableNumber)")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Menu démo en cours de développement")
                    .font(.title2)
                    .foregroundColor(.secondary)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Menu")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct VoiceAgentDemoView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "mic.circle.fill")
                    .font(.system(size: 100))
                    .foregroundColor(.green)
                
                Text("Assistant Vocal")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Assistant vocal démo en cours de développement")
                    .font(.title2)
                    .foregroundColor(.secondary)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Assistant Vocal")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct SplitBillDemoView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "person.2.fill")
                    .font(.system(size: 100))
                    .foregroundColor(.purple)
                
                Text("Partage d'Addition")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Split bill démo en cours de développement")
                    .font(.title2)
                    .foregroundColor(.secondary)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Split Bill")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct PaymentDemoView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "wave.3.right")
                    .font(.system(size: 100))
                    .foregroundColor(.red)
                
                Text("Paiement NFC")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Paiement NFC démo en cours de développement")
                    .font(.title2)
                    .foregroundColor(.secondary)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Paiement NFC")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    ContentView()
}