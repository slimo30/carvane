//
//  Promo.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation

enum PromoType: String, CaseIterable, Codable {
    case percentage = "Pourcentage"
    case fixedAmount = "Montant fixe"
    case buyOneGetOne = "Achetez 1, obtenez 1"
    case happyHour = "Happy Hour"
    case loyalty = "Fidélité"
    case antiWaste = "Anti-gaspillage"
}

struct Promo: Identifiable, Codable {
    let id = UUID()
    let code: String
    let name: String
    let description: String
    let type: PromoType
    let value: Double // percentage or fixed amount
    let isActive: Bool
    let validFrom: Date
    let validUntil: Date?
    let applicableCategories: [String]
    let minimumOrderAmount: Double?
    let maxUses: Int?
    let currentUses: Int
    
    var formattedValue: String {
        switch type {
        case .percentage:
            return "\(Int(value))%"
        case .fixedAmount, .buyOneGetOne:
            return "\(Int(value)) DA"
        case .happyHour, .loyalty, .antiWaste:
            return "\(Int(value))%"
        }
    }
    
    var isCurrentlyValid: Bool {
        let now = Date()
        return isActive && now >= validFrom && (validUntil == nil || now <= validUntil!)
    }
}

// Sample promos for testing
extension Promo {
    static let samplePromos = [
        Promo(
            code: "WELCOME10",
            name: "Bienvenue",
            description: "10% de réduction sur votre première commande",
            type: .percentage,
            value: 10.0,
            isActive: true,
            validFrom: Date(),
            validUntil: Calendar.current.date(byAdding: .month, value: 1, to: Date()),
            applicableCategories: [],
            minimumOrderAmount: nil,
            maxUses: 1,
            currentUses: 0
        ),
        Promo(
            code: "HAPPYHOUR",
            name: "Happy Hour",
            description: "15% de réduction entre 14h et 16h",
            type: .happyHour,
            value: 15.0,
            isActive: true,
            validFrom: Date(),
            validUntil: nil,
            applicableCategories: ["Boissons"],
            minimumOrderAmount: 500.0,
            maxUses: nil,
            currentUses: 0
        ),
        Promo(
            code: "ANTIWASTE",
            name: "Anti-gaspillage",
            description: "20% de réduction sur les plats du jour",
            type: .antiWaste,
            value: 20.0,
            isActive: true,
            validFrom: Date(),
            validUntil: nil,
            applicableCategories: ["Plats du jour"],
            minimumOrderAmount: nil,
            maxUses: nil,
            currentUses: 0
        ),
        Promo(
            code: "LOYALTY",
            name: "Fidélité",
            description: "5% de réduction pour les clients fidèles",
            type: .loyalty,
            value: 5.0,
            isActive: true,
            validFrom: Date(),
            validUntil: nil,
            applicableCategories: [],
            minimumOrderAmount: 1000.0,
            maxUses: nil,
            currentUses: 0
        )
    ]
}
