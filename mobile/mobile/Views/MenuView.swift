//
//  MenuView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct MenuView: View {
    let tableNumber: String
    @StateObject private var menuViewModel = MenuViewModel()
    @StateObject private var cartViewModel = CartViewModel()
    @StateObject private var voiceAgentViewModel = VoiceAgentViewModel()
    @State private var selectedTab = 0
    @State private var showCart = false
    @State private var showVoiceAgent = false
    @State private var showPromos = false
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Menu Tab
            VStack(spacing: 0) {
                // Header
                headerView
                
                // Promo Banner
                promoBanner
                
                // Category Filter
                categoryFilter
                
                // Search Bar
                searchBar
                
                // Menu Items
                menuItemsList
            }
            .tabItem {
                Image(systemName: "menucard")
                Text("Menu")
            }
            .tag(0)
            
            // Cart Tab
            CartView(
                cartViewModel: cartViewModel,
                tableNumber: tableNumber,
                onCheckout: {
                    selectedTab = 1
                }
            )
            .tabItem {
                Image(systemName: "cart")
                Text("Panier")
            }
            .badge(cartViewModel.cartItems.count > 0 ? cartViewModel.cartItems.count : nil)
            .tag(1)
            
            // Voice Agent Tab
            VoiceAgentView(viewModel: voiceAgentViewModel)
                .tabItem {
                    Image(systemName: "mic")
                    Text("Assistant")
                }
                .tag(2)
        }
        .accentColor(.orange)
        .onAppear {
            cartViewModel.tableNumber = tableNumber
        }
    }
    
    private var headerView: some View {
        VStack(spacing: 8) {
            HStack {
                VStack(alignment: .leading) {
                    Text("Restaurant Caravane")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Table #\(tableNumber)")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // NFC indicator
                HStack {
                    Image(systemName: "wave.3.right")
                        .foregroundColor(.green)
                    Text("NFC")
                        .font(.caption)
                        .fontWeight(.medium)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.green.opacity(0.1))
                .cornerRadius(15)
            }
            .padding(.horizontal)
            .padding(.top)
        }
        .background(Color(.systemBackground))
    }
    
    private var promoBanner: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(cartViewModel.availablePromos.prefix(3)) { promo in
                    PromoBanner(promo: promo)
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 8)
    }
    
    private var categoryFilter: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(menuViewModel.categories, id: \.self) { category in
                    Button(action: {
                        menuViewModel.setCategory(category)
                    }) {
                        Text(category)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(
                                menuViewModel.selectedCategory == category
                                    ? Color.orange
                                    : Color.gray.opacity(0.2)
                            )
                            .foregroundColor(
                                menuViewModel.selectedCategory == category
                                    ? .white
                                    : .primary
                            )
                            .cornerRadius(20)
                    }
                }
            }
            .padding(.horizontal)
        }
    }
    
    private var searchBar: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)
            
            TextField("Rechercher un plat...", text: $menuViewModel.searchText)
                .textFieldStyle(PlainTextFieldStyle())
                .onChange(of: menuViewModel.searchText) { newValue in
                    menuViewModel.setSearchText(newValue)
                }
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(10)
        .padding(.horizontal)
    }
    
    private var menuItemsList: some View {
        Group {
            if menuViewModel.isLoading {
                ProgressView("Chargement du menu...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if menuViewModel.filteredDishes.isEmpty {
                VStack(spacing: 16) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 50))
                        .foregroundColor(.gray)
                    Text("Aucun plat trouvé")
                        .font(.headline)
                        .foregroundColor(.gray)
                    Text("Essayez de modifier votre recherche")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(menuViewModel.filteredDishes) { dish in
                            DishRow(
                                dish: dish,
                                onAddToCart: { quantity, instructions in
                                    cartViewModel.addItem(dish, quantity: quantity, specialInstructions: instructions)
                                }
                            )
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 100) // Space for tab bar
                }
            }
        }
    }
}

#Preview {
    MenuView(tableNumber: "5")
}
