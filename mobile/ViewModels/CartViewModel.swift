//
//  CartViewModel.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation
import Combine

class CartViewModel: ObservableObject {
    @Published var cartItems: [CartItem] = []
    @Published var currentUser: User
    @Published var tableNumber: String = ""
    @Published var appliedPromos: [Promo] = []
    @Published var availablePromos: [Promo] = []
    
    init(currentUser: User = User.sampleUsers[0]) {
        self.currentUser = currentUser
        self.availablePromos = Promo.samplePromos
    }
    
    var totalAmount: Double {
        cartItems.reduce(0) { $0 + $1.totalPrice }
    }
    
    var discountAmount: Double {
        appliedPromos.reduce(0) { total, promo in
            switch promo.type {
            case .percentage:
                return total + (totalAmount * promo.value / 100)
            case .fixedAmount:
                return total + promo.value
            case .buyOneGetOne:
                // Simplified BOGO logic
                return total + (totalAmount * 0.5)
            case .happyHour, .loyalty, .antiWaste:
                return total + (totalAmount * promo.value / 100)
            }
        }
    }
    
    var finalAmount: Double {
        max(0, totalAmount - discountAmount)
    }
    
    var formattedTotal: String {
        String(format: "%.2f DA", totalAmount)
    }
    
    var formattedDiscount: String {
        String(format: "%.2f DA", discountAmount)
    }
    
    var formattedFinal: String {
        String(format: "%.2f DA", finalAmount)
    }
    
    func addItem(_ dish: Dish, quantity: Int = 1, specialInstructions: String? = nil) {
        if let existingIndex = cartItems.firstIndex(where: { $0.dish.id == dish.id && $0.specialInstructions == specialInstructions }) {
            cartItems[existingIndex] = CartItem(
                dish: dish,
                quantity: cartItems[existingIndex].quantity + quantity,
                specialInstructions: specialInstructions,
                addedBy: currentUser.name
            )
        } else {
            let newItem = CartItem(
                dish: dish,
                quantity: quantity,
                specialInstructions: specialInstructions,
                addedBy: currentUser.name
            )
            cartItems.append(newItem)
        }
        
        // Auto-apply eligible promos
        applyEligiblePromos()
    }
    
    func removeItem(_ item: CartItem) {
        cartItems.removeAll { $0.id == item.id }
        applyEligiblePromos()
    }
    
    func updateQuantity(for item: CartItem, newQuantity: Int) {
        if let index = cartItems.firstIndex(where: { $0.id == item.id }) {
            if newQuantity <= 0 {
                cartItems.remove(at: index)
            } else {
                cartItems[index] = CartItem(
                    dish: item.dish,
                    quantity: newQuantity,
                    specialInstructions: item.specialInstructions,
                    addedBy: item.addedBy
                )
            }
        }
        applyEligiblePromos()
    }
    
    func clearCart() {
        cartItems.removeAll()
        appliedPromos.removeAll()
    }
    
    func applyPromo(_ promo: Promo) {
        if !appliedPromos.contains(where: { $0.id == promo.id }) && isPromoEligible(promo) {
            appliedPromos.append(promo)
        }
    }
    
    func removePromo(_ promo: Promo) {
        appliedPromos.removeAll { $0.id == promo.id }
    }
    
    private func isPromoEligible(_ promo: Promo) -> Bool {
        guard promo.isCurrentlyValid else { return false }
        
        // Check minimum order amount
        if let minimumAmount = promo.minimumOrderAmount, totalAmount < minimumAmount {
            return false
        }
        
        // Check if promo applies to current items
        if !promo.applicableCategories.isEmpty {
            let hasApplicableItems = cartItems.contains { item in
                promo.applicableCategories.contains(item.dish.category)
            }
            if !hasApplicableItems { return false }
        }
        
        // Check usage limits
        if let maxUses = promo.maxUses, promo.currentUses >= maxUses {
            return false
        }
        
        return true
    }
    
    private func applyEligiblePromos() {
        appliedPromos.removeAll()
        
        for promo in availablePromos {
            if isPromoEligible(promo) {
                appliedPromos.append(promo)
            }
        }
    }
    
    func createSplitBill(numberOfPeople: Int, splitType: SplitType) -> SplitBill {
        return SplitBill(
            totalAmount: finalAmount,
            numberOfPeople: numberOfPeople,
            splitType: splitType,
            items: cartItems
        )
    }
}