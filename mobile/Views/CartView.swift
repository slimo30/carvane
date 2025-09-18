//
//  CartView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct CartView: View {
    @ObservedObject var cartViewModel: CartViewModel
    let tableNumber: String
    let onCheckout: () -> Void
    
    @StateObject private var splitBillViewModel = SplitBillViewModel()
    @StateObject private var paymentViewModel = PaymentViewModel()
    @State private var showSplitBill = false
    @State private var showPayment = false
    @State private var showPromos = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                if cartViewModel.cartItems.isEmpty {
                    emptyCartView
                } else {
                    cartContentView
                }
            }
            .navigationTitle("Panier")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Promos") {
                        showPromos = true
                    }
                    .disabled(cartViewModel.availablePromos.isEmpty)
                }
            }
        }
        .sheet(isPresented: $showSplitBill) {
            SplitBillView(
                cartViewModel: cartViewModel,
                splitBillViewModel: splitBillViewModel
            )
        }
        .sheet(isPresented: $showPayment) {
            PaymentView(
                cartViewModel: cartViewModel,
                paymentViewModel: paymentViewModel,
                tableNumber: tableNumber
            )
        }
        .sheet(isPresented: $showPromos) {
            PromosView(cartViewModel: cartViewModel)
        }
    }
    
    private var emptyCartView: some View {
        VStack(spacing: 20) {
            Image(systemName: "cart")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            
            Text("Votre panier est vide")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(.gray)
            
            Text("Ajoutez des plats délicieux à votre commande")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var cartContentView: some View {
        VStack(spacing: 0) {
            // Cart items list
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(cartViewModel.cartItems) { item in
                        CartItemRow(
                            item: item,
                            onUpdateQuantity: { newQuantity in
                                cartViewModel.updateQuantity(for: item, newQuantity: newQuantity)
                            },
                            onRemove: {
                                cartViewModel.removeItem(item)
                            }
                        )
                    }
                }
                .padding()
            }
            
            // Applied promos
            if !cartViewModel.appliedPromos.isEmpty {
                appliedPromosSection
            }
            
            // Total section
            totalSection
            
            // Action buttons
            actionButtons
        }
    }
    
    private var appliedPromosSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Promotions appliquées")
                .font(.headline)
                .padding(.horizontal)
            
            ForEach(cartViewModel.appliedPromos) { promo in
                HStack {
                    Image(systemName: "tag.fill")
                        .foregroundColor(.green)
                    
                    VStack(alignment: .leading) {
                        Text(promo.name)
                            .font(.subheadline)
                            .fontWeight(.medium)
                        Text(promo.description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    Text("-\(promo.formattedValue)")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.green)
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
                .background(Color.green.opacity(0.1))
                .cornerRadius(8)
                .padding(.horizontal)
            }
        }
        .padding(.vertical)
    }
    
    private var totalSection: some View {
        VStack(spacing: 8) {
            HStack {
                Text("Sous-total")
                Spacer()
                Text(cartViewModel.formattedTotal)
            }
            
            if cartViewModel.discountAmount > 0 {
                HStack {
                    Text("Réduction")
                        .foregroundColor(.green)
                    Spacer()
                    Text("-\(cartViewModel.formattedDiscount)")
                        .foregroundColor(.green)
                }
            }
            
            Divider()
            
            HStack {
                Text("Total")
                    .font(.headline)
                    .fontWeight(.bold)
                Spacer()
                Text(cartViewModel.formattedFinal)
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(.orange)
            }
        }
        .padding()
        .background(Color.gray.opacity(0.1))
    }
    
    private var actionButtons: some View {
        VStack(spacing: 12) {
            // Split bill button
            Button(action: {
                showSplitBill = true
            }) {
                HStack {
                    Image(systemName: "person.2.fill")
                    Text("Partager l'addition")
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .cornerRadius(12)
            }
            
            // Checkout button
            Button(action: {
                showPayment = true
            }) {
                HStack {
                    Image(systemName: "creditcard.fill")
                    Text("Payer - \(cartViewModel.formattedFinal)")
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.orange)
                .cornerRadius(12)
            }
        }
        .padding()
        .background(Color(.systemBackground))
    }
}

struct CartItemRow: View {
    let item: CartItem
    let onUpdateQuantity: (Int) -> Void
    let onRemove: () -> Void
    
    var body: some View {
        HStack(spacing: 12) {
            // Dish image
            AsyncImage(url: URL(string: "https://picsum.photos/60/60?random=\(item.dish.id.uuidString.prefix(8))")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Color.gray.opacity(0.3))
            }
            .frame(width: 60, height: 60)
            .cornerRadius(8)
            .clipped()
            
            // Dish info
            VStack(alignment: .leading, spacing: 4) {
                Text(item.dish.name)
                    .font(.headline)
                    .fontWeight(.medium)
                
                if let instructions = item.specialInstructions {
                    Text(instructions)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .italic()
                }
                
                Text("Ajouté par \(item.addedBy)")
                    .font(.caption)
                    .foregroundColor(.blue)
            }
            
            Spacer()
            
            // Quantity and price
            VStack(alignment: .trailing, spacing: 8) {
                // Quantity controls
                HStack(spacing: 8) {
                    Button(action: {
                        onUpdateQuantity(item.quantity - 1)
                    }) {
                        Image(systemName: "minus.circle.fill")
                            .foregroundColor(.orange)
                    }
                    
                    Text("\(item.quantity)")
                        .font(.headline)
                        .fontWeight(.semibold)
                        .frame(minWidth: 30)
                    
                    Button(action: {
                        onUpdateQuantity(item.quantity + 1)
                    }) {
                        Image(systemName: "plus.circle.fill")
                            .foregroundColor(.orange)
                    }
                }
                
                Text(item.formattedTotal)
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(.orange)
            }
            }
            .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
        .contextMenu {
            Button("Supprimer", role: .destructive) {
                onRemove()
            }
        }
    }
}

#Preview {
    CartView(
        cartViewModel: CartViewModel(),
        tableNumber: "5",
        onCheckout: {}
    )
}