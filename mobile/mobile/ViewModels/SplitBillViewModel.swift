//
//  SplitBillViewModel.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation
import Combine

class SplitBillViewModel: ObservableObject {
    @Published var splitBill: SplitBill?
    @Published var numberOfPeople: Int = 2
    @Published var splitType: SplitType = .equal
    @Published var individualPayments: [IndividualPayment] = []
    @Published var isSplitActive: Bool = false
    
    struct IndividualPayment: Identifiable {
        let id = UUID()
        let personName: String
        let amount: Double
        let isPaid: Bool
        let paymentMethod: PaymentMethod?
        
        var formattedAmount: String {
            String(format: "%.2f DA", amount)
        }
    }
    
    func createSplitBill(from cartItems: [CartItem], totalAmount: Double) {
        splitBill = SplitBill(
            totalAmount: totalAmount,
            numberOfPeople: numberOfPeople,
            splitType: splitType,
            items: cartItems
        )
        
        generateIndividualPayments()
        isSplitActive = true
    }
    
    private func generateIndividualPayments() {
        guard let split = splitBill else { return }
        
        individualPayments = []
        
        switch splitType {
        case .equal:
            let amountPerPerson = split.amountPerPerson
            for i in 0..<numberOfPeople {
                individualPayments.append(IndividualPayment(
                    personName: "Personne \(i + 1)",
                    amount: amountPerPerson,
                    isPaid: false,
                    paymentMethod: nil
                ))
            }
            
        case .byItems:
            // For simplicity, we'll distribute items equally among people
            // In a real app, this would be more complex
            let amountPerPerson = split.amountPerPerson
            for i in 0..<numberOfPeople {
                individualPayments.append(IndividualPayment(
                    personName: "Personne \(i + 1)",
                    amount: amountPerPerson,
                    isPaid: false,
                    paymentMethod: nil
                ))
            }
        }
    }
    
    func updateNumberOfPeople(_ count: Int) {
        numberOfPeople = max(2, count)
        if isSplitActive {
            createSplitBill(from: splitBill?.items ?? [], totalAmount: splitBill?.totalAmount ?? 0)
        }
    }
    
    func updateSplitType(_ type: SplitType) {
        splitType = type
        if isSplitActive {
            createSplitBill(from: splitBill?.items ?? [], totalAmount: splitBill?.totalAmount ?? 0)
        }
    }
    
    func markPaymentAsPaid(for personId: UUID, method: PaymentMethod) {
        if let index = individualPayments.firstIndex(where: { $0.id == personId }) {
            individualPayments[index] = IndividualPayment(
                personName: individualPayments[index].personName,
                amount: individualPayments[index].amount,
                isPaid: true,
                paymentMethod: method
            )
        }
    }
    
    var allPaymentsCompleted: Bool {
        individualPayments.allSatisfy { $0.isPaid }
    }
    
    var totalPaidAmount: Double {
        individualPayments.filter { $0.isPaid }.reduce(0) { $0 + $1.amount }
    }
    
    var remainingAmount: Double {
        (splitBill?.totalAmount ?? 0) - totalPaidAmount
    }
    
    func resetSplit() {
        splitBill = nil
        individualPayments = []
        isSplitActive = false
        numberOfPeople = 2
        splitType = .equal
    }
}
