//
//  MenuViewModel.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation
import Combine

class MenuViewModel: ObservableObject {
    @Published var dishes: [Dish] = []
    @Published var filteredDishes: [Dish] = []
    @Published var selectedCategory: String = "Tous"
    @Published var searchText: String = ""
    @Published var isLoading: Bool = false
    
    let categories = ["Tous", "Plats Traditionnels", "Salades", "Pizzas", "Burgers", "Grillades", "Boissons", "Desserts"]
    
    init() {
        loadDishes()
    }
    
    func loadDishes() {
        isLoading = true
        // Simulate network delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.dishes = Dish.sampleDishes
            self.filteredDishes = self.dishes
            self.isLoading = false
        }
    }
    
    func filterDishes() {
        var filtered = dishes
        
        // Filter by category
        if selectedCategory != "Tous" {
            filtered = filtered.filter { $0.category == selectedCategory }
        }
        
        // Filter by search text
        if !searchText.isEmpty {
            filtered = filtered.filter { dish in
                dish.name.localizedCaseInsensitiveContains(searchText) ||
                dish.description.localizedCaseInsensitiveContains(searchText) ||
                dish.category.localizedCaseInsensitiveContains(searchText)
            }
        }
        
        // Filter available dishes only
        filtered = filtered.filter { $0.isAvailable }
        
        filteredDishes = filtered
    }
    
    func setCategory(_ category: String) {
        selectedCategory = category
        filterDishes()
    }
    
    func setSearchText(_ text: String) {
        searchText = text
        filterDishes()
    }
    
    func getDishesByCategory(_ category: String) -> [Dish] {
        if category == "Tous" {
            return dishes.filter { $0.isAvailable }
        }
        return dishes.filter { $0.category == category && $0.isAvailable }
    }
    
    func searchDishes(query: String) -> [Dish] {
        if query.isEmpty {
            return getDishesByCategory(selectedCategory)
        }
        
        return dishes.filter { dish in
            dish.name.localizedCaseInsensitiveContains(query) ||
            dish.description.localizedCaseInsensitiveContains(query) ||
            dish.category.localizedCaseInsensitiveContains(query)
        }.filter { $0.isAvailable }
    }
}
