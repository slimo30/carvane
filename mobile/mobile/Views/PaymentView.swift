//
//  PaymentView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct PaymentView: View {
    @ObservedObject var cartViewModel: CartViewModel
    @ObservedObject var paymentViewModel: PaymentViewModel
    let tableNumber: String
    @Environment(\.dismiss) private var dismiss
    
    @State private var selectedMethod: PaymentMethod = .nfc
    @State private var showSuccess = false
    @State private var orderNumber = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                if showSuccess {
                    paymentSuccessView
                } else {
                    paymentContentView
                }
            }
            .navigationTitle("Paiement")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                if !showSuccess {
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button("Annuler") {
                            dismiss()
                        }
                    }
                }
            }
        }
        .onAppear {
            paymentViewModel.checkNFCAvailability()
            orderNumber = generateOrderNumber()
        }
    }
    
    private var paymentContentView: some View {
        VStack(spacing: 24) {
            // Order summary
            orderSummarySection
            
            // Payment method selection
            paymentMethodSection
            
            // NFC availability indicator
            if selectedMethod == .nfc {
                nfcAvailabilitySection
            }
            
            Spacer()
            
            // Pay button
            payButton
        }
        .padding()
    }
    
    private var orderSummarySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Résumé de la commande")
                .font(.headline)
                .fontWeight(.bold)
            
            VStack(spacing: 8) {
                HStack {
                    Text("Table #\(tableNumber)")
                    Spacer()
                    Text("Commande #\(orderNumber)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Divider()
                
                HStack {
                    Text("Sous-total")
                    Spacer()
                    Text(cartViewModel.formattedTotal)
                }
                
                if cartViewModel.discountAmount > 0 {
                    HStack {
                        Text("Réduction")
                            .foregroundColor(.green)
                        Spacer()
                        Text("-\(cartViewModel.formattedDiscount)")
                            .foregroundColor(.green)
                    }
                }
                
                Divider()
                
                HStack {
                    Text("Total")
                        .font(.headline)
                        .fontWeight(.bold)
                    Spacer()
                    Text(cartViewModel.formattedFinal)
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.orange)
                }
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
        }
    }
    
    private var paymentMethodSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Méthode de paiement")
                .font(.headline)
                .fontWeight(.bold)
            
            VStack(spacing: 8) {
                ForEach(PaymentMethod.allCases, id: \.self) { method in
                    Button(action: {
                        selectedMethod = method
                    }) {
                        HStack {
                            Image(systemName: methodIcon(method))
                                .foregroundColor(.orange)
                                .frame(width: 24)
                            
                            VStack(alignment: .leading) {
                                Text(method.rawValue)
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                Text(methodDescription(method))
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            if selectedMethod == method {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.orange)
                            }
                        }
                        .padding()
                        .background(
                            selectedMethod == method
                                ? Color.orange.opacity(0.1)
                                : Color.gray.opacity(0.1)
                        )
                        .cornerRadius(8)
                    }
                }
            }
        }
    }
    
    private var nfcAvailabilitySection: some View {
        HStack {
            Image(systemName: paymentViewModel.isNFCAvailable ? "checkmark.circle.fill" : "xmark.circle.fill")
                .foregroundColor(paymentViewModel.isNFCAvailable ? .green : .red)
            
            Text(paymentViewModel.isNFCAvailable ? "NFC disponible" : "NFC non disponible")
                .font(.subheadline)
                .foregroundColor(paymentViewModel.isNFCAvailable ? .green : .red)
            
            Spacer()
        }
        .padding()
        .background(
            paymentViewModel.isNFCAvailable
                ? Color.green.opacity(0.1)
                : Color.red.opacity(0.1)
        )
        .cornerRadius(8)
    }
    
    private var payButton: some View {
        Button(action: {
            processPayment()
        }) {
            HStack {
                if paymentViewModel.isProcessing {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.8)
                } else {
                    Image(systemName: selectedMethod == .nfc ? "wave.3.right" : "creditcard.fill")
                }
                
                Text(paymentViewModel.isProcessing ? "Traitement..." : "Payer \(cartViewModel.formattedFinal)")
            }
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding()
            .background(
                paymentViewModel.isProcessing
                    ? Color.gray
                    : Color.orange
            )
            .cornerRadius(12)
        }
        .disabled(paymentViewModel.isProcessing || (selectedMethod == .nfc && !paymentViewModel.isNFCAvailable))
    }
    
    private var paymentSuccessView: some View {
        VStack(spacing: 24) {
            // Success animation
            VStack(spacing: 16) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 80))
                    .foregroundColor(.green)
                    .scaleEffect(showSuccess ? 1.0 : 0.5)
                    .animation(.spring(response: 0.6, dampingFraction: 0.8), value: showSuccess)
                
                Text("Paiement réussi!")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.green)
                
                Text("Votre commande a été confirmée")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            // Order details
            VStack(spacing: 12) {
                Text("Détails de la commande")
                    .font(.headline)
                    .fontWeight(.bold)
                
                VStack(spacing: 8) {
                    HStack {
                        Text("Numéro de commande")
                        Spacer()
                        Text("#\(orderNumber)")
                            .fontWeight(.medium)
                    }
                    
                    HStack {
                        Text("Table")
                        Spacer()
                        Text("#\(tableNumber)")
                            .fontWeight(.medium)
                    }
                    
                    HStack {
                        Text("Montant payé")
                        Spacer()
                        Text(cartViewModel.formattedFinal)
                            .fontWeight(.bold)
                            .foregroundColor(.orange)
                    }
                    
                    HStack {
                        Text("Méthode")
                        Spacer()
                        Text(selectedMethod.rawValue)
                            .fontWeight(.medium)
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(12)
            }
            
            // Status info
            VStack(spacing: 8) {
                HStack {
                    Image(systemName: "clock")
                        .foregroundColor(.orange)
                    Text("Temps de préparation estimé: 15-25 minutes")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    Image(systemName: "bell")
                        .foregroundColor(.blue)
                    Text("Vous serez notifié quand votre commande sera prête")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }
            .padding()
            .background(Color.blue.opacity(0.1))
            .cornerRadius(12)
            
            Spacer()
            
            // Done button
            Button(action: {
                dismiss()
            }) {
                Text("Terminé")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .cornerRadius(12)
            }
        }
        .padding()
        .onAppear {
            withAnimation {
                showSuccess = true
            }
        }
    }
    
    private func methodIcon(_ method: PaymentMethod) -> String {
        switch method {
        case .nfc:
            return "wave.3.right"
        case .card:
            return "creditcard"
        case .cash:
            return "banknote"
        case .wallet:
            return "wallet.pass"
        }
    }
    
    private func methodDescription(_ method: PaymentMethod) -> String {
        switch method {
        case .nfc:
            return "Touchez votre téléphone ou carte"
        case .card:
            return "Saisissez vos informations de carte"
        case .cash:
            return "Paiement en espèces au comptoir"
        case .wallet:
            return "Utilisez votre portefeuille digital"
        }
    }
    
    private func processPayment() {
        paymentViewModel.processPayment(
            amount: cartViewModel.finalAmount,
            orderId: orderNumber
        )
        
        // Simulate payment processing
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            if paymentViewModel.paymentStatus == .success {
                showSuccess = true
            }
        }
    }
    
    private func generateOrderNumber() -> String {
        let timestamp = Int(Date().timeIntervalSince1970)
        return "\(timestamp)"
    }
}

#Preview {
    PaymentView(
        cartViewModel: CartViewModel(),
        paymentViewModel: PaymentViewModel(),
        tableNumber: "5"
    )
}

