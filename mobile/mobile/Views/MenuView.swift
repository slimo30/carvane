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
            .badge(cartViewModel.cartItems.count)
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
        VStack(spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) { 
                    Text("Restaurant Caravane")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Table #\(tableNumber)")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // NFC indicator
                HStack(spacing: 6) {
                    Image(systemName: "wave.3.right")
                        .foregroundColor(.green)
                    Text("NFC")
                        .font(.caption)
                        .fontWeight(.medium)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color.green.opacity(0.1))
                .cornerRadius(15)
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
            .padding(.bottom, 8)
        }
        .background(Color(.systemBackground))
    }
    
    private var promoBanner: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(cartViewModel.availablePromos.prefix(3)) { promo in
                    PromoBanner(promo: promo)
                }
            }
            .padding(.horizontal, 20)
        }
        .padding(.vertical, 12)
    }
    
    private var categoryFilter: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 16) {
                ForEach(menuViewModel.categories, id: \.self) { category in
                    Button(action: {
                        menuViewModel.setCategory(category)
                    }) {
                        Text(category)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
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
            .padding(.horizontal, 20)
        }
        .padding(.vertical, 16)
    }
    
    private var searchBar: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)
                .font(.system(size: 16))
            
            TextField("Rechercher un plat...", text: $menuViewModel.searchText)
                .textFieldStyle(PlainTextFieldStyle())
                .font(.body)
                .onChange(of: menuViewModel.searchText) { newValue in
                    menuViewModel.setSearchText(newValue)
                }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .background(Color.gray.opacity(0.1))
        .cornerRadius(12)
        .padding(.horizontal, 20)
        .padding(.bottom, 20)
    }
    
    private var menuItemsList: some View {
        Group {
            if menuViewModel.isLoading {
                VStack(spacing: 16) {
                    ProgressView()
                        .scaleEffect(1.2)
                    Text("Chargement du menu...")
                        .font(.headline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(.top, 40)
            } else if menuViewModel.filteredDishes.isEmpty {
                VStack(spacing: 20) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 60))
                        .foregroundColor(.gray.opacity(0.6))
                    Text("Aucun plat trouvé")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    Text("Essayez de modifier votre recherche")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(.top, 40)
            } else {
                ScrollView {
                    LazyVStack(spacing: 16) {
                        ForEach(menuViewModel.filteredDishes) { dish in
                            DishRow(
                                dish: dish,
                                onAddToCart: { quantity, instructions in
                                    cartViewModel.addItem(dish, quantity: quantity, specialInstructions: instructions)
                                }
                            )
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                    .padding(.bottom, 120) // Extra space for tab bar
                }
            }
        }
    }
}

#Preview {
    MenuView(tableNumber: "5")
}