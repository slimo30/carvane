//
//  SplitBillView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct SplitBillView: View {
    @ObservedObject var cartViewModel: CartViewModel
    @ObservedObject var splitBillViewModel: SplitBillViewModel
    @Environment(\.dismiss) private var dismiss
    
    @State private var showPayment = false
    @State private var selectedPerson: UUID?
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                if !splitBillViewModel.isSplitActive {
                    setupSplitBillView
                } else {
                    splitBillContentView
                }
            }
            .navigationTitle("Partager l'addition")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
                
                if splitBillViewModel.isSplitActive {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Réinitialiser") {
                            splitBillViewModel.resetSplit()
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showPayment) {
            if let personId = selectedPerson {
                IndividualPaymentView(
                    personId: personId,
                    splitBillViewModel: splitBillViewModel
                )
            }
        }
    }
    
    private var setupSplitBillView: some View {
        VStack(spacing: 24) {
            // Header
            VStack(spacing: 8) {
                Text("Partager l'addition")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("Choisissez comment diviser le montant")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            .padding(.top, 40)
            
            // Number of people
            VStack(alignment: .leading, spacing: 12) {
                Text("Nombre de personnes")
                    .font(.headline)
                
                HStack {
                    Button(action: {
                        splitBillViewModel.updateNumberOfPeople(splitBillViewModel.numberOfPeople - 1)
                    }) {
                        Image(systemName: "minus.circle.fill")
                            .font(.title2)
                            .foregroundColor(splitBillViewModel.numberOfPeople > 2 ? .orange : .gray)
                    }
                    .disabled(splitBillViewModel.numberOfPeople <= 2)
                    
                    Text("\(splitBillViewModel.numberOfPeople)")
                        .font(.title)
                        .fontWeight(.bold)
                        .frame(minWidth: 60)
                    
                    Button(action: {
                        splitBillViewModel.updateNumberOfPeople(splitBillViewModel.numberOfPeople + 1)
                    }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                            .foregroundColor(.orange)
                    }
                }
                .frame(maxWidth: .infinity)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
            
            // Split type
            VStack(alignment: .leading, spacing: 12) {
                Text("Type de partage")
                    .font(.headline)
                
                VStack(spacing: 8) {
                    ForEach(SplitType.allCases, id: \.self) { type in
                        Button(action: {
                            splitBillViewModel.updateSplitType(type)
                        }) {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(type.rawValue)
                                        .font(.headline)
                                        .foregroundColor(.primary)
                                    
                                    Text(splitTypeDescription(type))
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                if splitBillViewModel.splitType == type {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(.orange)
                                }
                            }
                            .padding()
                            .background(
                                splitBillViewModel.splitType == type
                                    ? Color.orange.opacity(0.1)
                                    : Color.gray.opacity(0.1)
                            )
                            .cornerRadius(8)
                        }
                    }
                }
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
            
            // Total amount
            VStack(spacing: 8) {
                Text("Montant total")
                    .font(.headline)
                
                Text(cartViewModel.formattedFinal)
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.orange)
                
                Text("\(String(format: "%.2f DA", cartViewModel.finalAmount / Double(splitBillViewModel.numberOfPeople))) par personne")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color.orange.opacity(0.1))
            .cornerRadius(12)
            
            Spacer()
            
            // Create split button
            Button(action: {
                splitBillViewModel.createSplitBill(
                    from: cartViewModel.cartItems,
                    totalAmount: cartViewModel.finalAmount
                )
            }) {
                Text("Créer le partage")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.orange)
                    .cornerRadius(12)
            }
            .padding(.bottom, 40)
        }
        .padding()
    }
    
    private var splitBillContentView: some View {
        VStack(spacing: 0) {
            // Summary
            VStack(spacing: 12) {
                HStack {
                    Text("Total à partager")
                    Spacer()
                    Text(cartViewModel.formattedFinal)
                        .fontWeight(.bold)
                        .foregroundColor(.orange)
                }
                
                HStack {
                    Text("Par personne")
                    Spacer()
                    Text(splitBillViewModel.formattedAmountPerPerson)
                        .fontWeight(.bold)
                        .foregroundColor(.blue)
                }
                
                Divider()
                
                HStack {
                    Text("Payé")
                    Spacer()
                    Text(String(format: "%.2f DA", splitBillViewModel.totalPaidAmount))
                        .fontWeight(.bold)
                        .foregroundColor(.green)
                }
                
                if splitBillViewModel.remainingAmount > 0 {
                    HStack {
                        Text("Restant")
                        Spacer()
                        Text(String(format: "%.2f DA", splitBillViewModel.remainingAmount))
                            .fontWeight(.bold)
                            .foregroundColor(.red)
                    }
                }
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            
            // Individual payments
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(splitBillViewModel.individualPayments) { payment in
                        IndividualPaymentRow(
                            payment: payment,
                            onPay: {
                                selectedPerson = payment.id
                                showPayment = true
                            }
                        )
                    }
                }
                .padding()
            }
            
            // Complete button
            if splitBillViewModel.allPaymentsCompleted {
                Button(action: {
                    // Process complete order
                    dismiss()
                }) {
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                        Text("Commande complète")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .cornerRadius(12)
                }
                .padding()
            }
        }
    }
    
    private func splitTypeDescription(_ type: SplitType) -> String {
        switch type {
        case .equal:
            return "Montant divisé équitablement entre toutes les personnes"
        case .byItems:
            return "Chaque personne paie pour ses propres articles"
        }
    }
}

struct IndividualPaymentRow: View {
    let payment: SplitBillViewModel.IndividualPayment
    let onPay: () -> Void
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(payment.personName)
                    .font(.headline)
                    .fontWeight(.medium)
                
                Text(payment.formattedAmount)
                    .font(.subheadline)
                    .foregroundColor(.orange)
                
                if let method = payment.paymentMethod {
                    Text("Payé via \(method.rawValue)")
                        .font(.caption)
                        .foregroundColor(.green)
                }
            }
            
            Spacer()
            
            if payment.isPaid {
                Image(systemName: "checkmark.circle.fill")
                    .font(.title2)
                    .foregroundColor(.green)
            } else {
                Button(action: onPay) {
                    Text("Payer")
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Color.orange)
                        .cornerRadius(8)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
    }
}

struct IndividualPaymentView: View {
    let personId: UUID
    @ObservedObject var splitBillViewModel: SplitBillViewModel
    @Environment(\.dismiss) private var dismiss
    
    @StateObject private var paymentViewModel = PaymentViewModel()
    @State private var selectedMethod: PaymentMethod = .nfc
    
    private var payment: SplitBillViewModel.IndividualPayment? {
        splitBillViewModel.individualPayments.first { $0.id == personId }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                if let payment = payment {
                    // Payment info
                    VStack(spacing: 12) {
                        Text("Paiement de \(payment.personName)")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text(payment.formattedAmount)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.orange)
                    }
                    .padding()
                    .background(Color.orange.opacity(0.1))
                    .cornerRadius(12)
                    
                    // Payment method selection
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Méthode de paiement")
                            .font(.headline)
                        
                        ForEach(PaymentMethod.allCases, id: \.self) { method in
                            Button(action: {
                                selectedMethod = method
                            }) {
                                HStack {
                                    Image(systemName: methodIcon(method))
                                        .foregroundColor(.orange)
                                    
                                    Text(method.rawValue)
                                        .font(.headline)
                                        .foregroundColor(.primary)
                                    
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
                    
                    Spacer()
                    
                    // Pay button
                    Button(action: {
                        processPayment()
                    }) {
                        HStack {
                            Image(systemName: "creditcard.fill")
                            Text("Payer \(payment.formattedAmount)")
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.orange)
                        .cornerRadius(12)
                    }
                    .disabled(paymentViewModel.isProcessing)
                }
            }
            .padding()
            .navigationTitle("Paiement")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            paymentViewModel.checkNFCAvailability()
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
    
    private func processPayment() {
        guard let payment = payment else { return }
        
        paymentViewModel.processPayment(amount: payment.amount, orderId: UUID().uuidString)
        
        // Simulate payment success
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            splitBillViewModel.markPaymentAsPaid(for: personId, method: selectedMethod)
            dismiss()
        }
    }
}

#Preview {
    SplitBillView(
        cartViewModel: CartViewModel(),
        splitBillViewModel: SplitBillViewModel()
    )
}

