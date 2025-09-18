//
//  PaymentViewModel.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation
import Combine

enum PaymentMethod: String, CaseIterable {
    case nfc = "NFC"
    case card = "Carte bancaire"
    case cash = "Espèces"
    case wallet = "Portefeuille digital"
}

enum PaymentStatus {
    case pending
    case processing
    case success
    case failed
    case cancelled
}

class PaymentViewModel: ObservableObject {
    @Published var selectedPaymentMethod: PaymentMethod = .nfc
    @Published var paymentStatus: PaymentStatus = .pending
    @Published var isNFCAvailable: Bool = true
    @Published var isProcessing: Bool = false
    @Published var paymentError: String?
    
    func processPayment(amount: Double, orderId: String) {
        guard !isProcessing else { return }
        
        isProcessing = true
        paymentStatus = .processing
        paymentError = nil
        
        // Simulate payment processing
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            // Simulate 90% success rate
            let success = Bool.random() ? true : (Double.random(in: 0...1) < 0.9)
            
            if success {
                self.paymentStatus = .success
            } else {
                self.paymentStatus = .failed
                self.paymentError = "Paiement échoué. Veuillez réessayer."
            }
            
            self.isProcessing = false
        }
    }
    
    func simulateNFCPayment(amount: Double) {
        guard selectedPaymentMethod == .nfc else { return }
        
        isProcessing = true
        paymentStatus = .processing
        
        // Simulate NFC tap
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.paymentStatus = .success
            self.isProcessing = false
        }
    }
    
    func resetPayment() {
        paymentStatus = .pending
        paymentError = nil
        isProcessing = false
    }
    
    func checkNFCAvailability() {
        // In a real app, this would check device NFC capability
        isNFCAvailable = true
    }
}