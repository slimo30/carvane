//
//  Order.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation

enum OrderStatus: String, CaseIterable, Codable {
    case pending = "En attente"
    case preparing = "En préparation"
    case ready = "Prêt"
    case served = "Servi"
    case cancelled = "Annulé"
}

struct Order: Identifiable, Codable {
    let id = UUID()
    let tableNumber: String
    let items: [CartItem]
    let totalAmount: Double
    let discountAmount: Double
    let finalAmount: Double
    let status: OrderStatus
    let createdAt: Date
    let estimatedReadyTime: Date?
    let notes: String?
    
    var formattedTotal: String {
        return String(format: "%.2f DA", totalAmount)
    }
    
    var formattedFinal: String {
        return String(format: "%.2f DA", finalAmount)
    }
}

struct CartItem: Identifiable, Codable {
    let id = UUID()
    let dish: Dish
    let quantity: Int
    let specialInstructions: String?
    let addedBy: String // User who added this item
    
    var totalPrice: Double {
        return dish.price * Double(quantity)
    }
    
    var formattedTotal: String {
        return String(format: "%.2f DA", totalPrice)
    }
}

// Split bill logic
struct SplitBill {
    let totalAmount: Double
    let numberOfPeople: Int
    let splitType: SplitType
    let items: [CartItem]
    
    var amountPerPerson: Double {
        return totalAmount / Double(numberOfPeople)
    }
    
    var formattedAmountPerPerson: String {
        return String(format: "%.2f DA", amountPerPerson)
    }
    
    func itemsForPerson(_ personIndex: Int) -> [CartItem] {
        switch splitType {
        case .equal:
            // For equal split, we don't track individual items per person
            return []
        case .byItems:
            // This would need more complex logic to track who ordered what
            return []
        }
    }
}

enum SplitType: String, CaseIterable {
    case equal = "Égal"
    case byItems = "Par articles"
}
