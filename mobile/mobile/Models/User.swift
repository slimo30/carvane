//
//  User.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation

struct User: Identifiable, Codable {
    let id = UUID()
    let name: String
    let email: String?
    let phoneNumber: String?
    let isGuest: Bool
    let loyaltyPoints: Int
    let preferences: UserPreferences
    
    init(name: String, email: String? = nil, phoneNumber: String? = nil, isGuest: Bool = true) {
        self.name = name
        self.email = email
        self.phoneNumber = phoneNumber
        self.isGuest = isGuest
        self.loyaltyPoints = 0
        self.preferences = UserPreferences()
    }
}

struct UserPreferences: Codable {
    var dietaryRestrictions: [String] = []
    var allergies: [String] = []
    var favoriteCategories: [String] = []
    var spiceLevel: SpiceLevel = .medium
    var language: Language = .french
}

enum SpiceLevel: String, CaseIterable, Codable {
    case mild = "Doux"
    case medium = "Moyen"
    case hot = "Épicé"
    case extraHot = "Très épicé"
}

enum Language: String, CaseIterable, Codable {
    case french = "Français"
    case arabic = "العربية"
    case english = "English"
}

// Sample users for testing
extension User {
    static let sampleUsers = [
        User(name: "Omar", email: "omar@example.com", isGuest: false),
        User(name: "Ahmed", email: "ahmed@example.com", isGuest: false),
        User(name: "Fatima", email: "fatima@example.com", isGuest: false),
        User(name: "Invité", isGuest: true)
    ]
}
