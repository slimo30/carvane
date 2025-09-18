//
//  Dish.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation

struct Dish: Identifiable, Codable {
    let id = UUID()
    let name: String
    let description: String
    let price: Double
    let imageName: String
    let category: String
    let allergens: [String]
    let isAvailable: Bool
    let preparationTime: Int // in minutes
    let calories: Int?
    let isVegetarian: Bool
    let isGlutenFree: Bool
    let isSpicy: Bool
    
    var formattedPrice: String {
        return String(format: "%.2f DA", price)
    }
}

// Sample data for testing
extension Dish {
    static let sampleDishes = [
        Dish(
            name: "Couscous Royal",
            description: "Couscous traditionnel avec légumes, viande et merguez",
            price: 1200.0,
            imageName: "couscous",
            category: "Plats Traditionnels",
            allergens: ["gluten"],
            isAvailable: true,
            preparationTime: 25,
            calories: 450,
            isVegetarian: false,
            isGlutenFree: false,
            isSpicy: false
        ),
        Dish(
            name: "Tajine de Poulet",
            description: "Tajine de poulet aux légumes et épices marocaines",
            price: 950.0,
            imageName: "tajine",
            category: "Plats Traditionnels",
            allergens: [],
            isAvailable: true,
            preparationTime: 30,
            calories: 380,
            isVegetarian: false,
            isGlutenFree: true,
            isSpicy: false
        ),
        Dish(
            name: "Salade César",
            description: "Salade fraîche avec croûtons, parmesan et sauce césar",
            price: 650.0,
            imageName: "salad",
            category: "Salades",
            allergens: ["gluten", "lactose"],
            isAvailable: true,
            preparationTime: 10,
            calories: 250,
            isVegetarian: true,
            isGlutenFree: false,
            isSpicy: false
        ),
        Dish(
            name: "Pizza Margherita",
            description: "Pizza classique avec tomate, mozzarella et basilic",
            price: 800.0,
            imageName: "pizza",
            category: "Pizzas",
            allergens: ["gluten", "lactose"],
            isAvailable: true,
            preparationTime: 15,
            calories: 320,
            isVegetarian: true,
            isGlutenFree: false,
            isSpicy: false
        ),
        Dish(
            name: "Burger Deluxe",
            description: "Burger avec steak, fromage, salade et frites",
            price: 1100.0,
            imageName: "burger",
            category: "Burgers",
            allergens: ["gluten", "lactose"],
            isAvailable: true,
            preparationTime: 20,
            calories: 650,
            isVegetarian: false,
            isGlutenFree: false,
            isSpicy: false
        ),
        Dish(
            name: "Poulet Grillé",
            description: "Poulet grillé aux herbes avec riz et légumes",
            price: 900.0,
            imageName: "chicken",
            category: "Grillades",
            allergens: [],
            isAvailable: true,
            preparationTime: 25,
            calories: 420,
            isVegetarian: false,
            isGlutenFree: true,
            isSpicy: false
        )
    ]
}
