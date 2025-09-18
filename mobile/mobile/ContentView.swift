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
                    description: "Scannez et commandez en un clic"
                )
                
                FeatureRow(
                    icon: "mic.circle.fill",
                    title: "Assistant Vocal",
                    description: "Posez vos questions sur le menu"
                )
                
                FeatureRow(
                    icon: "person.2.fill",
                    title: "Partage d'addition",
                    description: "Divisez l'addition automatiquement"
                )
                
                FeatureRow(
                    icon: "wave.3.right",
                    title: "Paiement NFC",
                    description: "Payez en touchant votre téléphone"
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
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.orange)
                .frame(width: 30)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(12)
    }
}

#Preview {
    ContentView()
}
