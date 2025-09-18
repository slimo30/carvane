//
//  DishRow.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct DishRow: View {
    let dish: Dish
    let onAddToCart: (Int, String?) -> Void
    
    @State private var quantity = 1
    @State private var specialInstructions = ""
    @State private var showDetails = false
    @State private var showAddToCart = false
    
    var body: some View {
        VStack(spacing: 0) {
            HStack(alignment: .top, spacing: 16) {
                // Dish Image
                AsyncImage(url: URL(string: "https://picsum.photos/100/100?random=\(dish.id.uuidString.prefix(8))")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Color.gray.opacity(0.3))
                        .overlay(
                            Image(systemName: "photo")
                                .foregroundColor(.gray)
                        )
                }
                .frame(width: 90, height: 90)
                .cornerRadius(14)
                .clipped()
                
                // Dish Info
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(dish.name)
                            .font(.headline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                            .lineLimit(1)
                        
                        Spacer()
                        
                        Text(dish.formattedPrice)
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.orange)
                    }
                    
                    Text(dish.description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                        .padding(.top, 2)
                    
                    // Allergens and badges
                    HStack(spacing: 10) {
                        if !dish.allergens.isEmpty {
                            HStack(spacing: 4) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundColor(.red)
                                    .font(.caption)
                                Text(dish.allergens.joined(separator: ", "))
                                    .font(.caption)
                                    .foregroundColor(.red)
                            }
                        }
                        
                        if dish.isVegetarian {
                            Text("Végétarien")
                                .font(.caption)
                                .fontWeight(.medium)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.green.opacity(0.2))
                                .foregroundColor(.green)
                                .cornerRadius(6)
                        }
                        
                        if dish.isGlutenFree {
                            Text("Sans gluten")
                                .font(.caption)
                                .fontWeight(.medium)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.blue.opacity(0.2))
                                .foregroundColor(.blue)
                                .cornerRadius(6)
                        }
                        
                        if dish.isSpicy {
                            Text("Épicé")
                                .font(.caption)
                                .fontWeight(.medium)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.red.opacity(0.2))
                                .foregroundColor(.red)
                                .cornerRadius(6)
                        }
                    }
                    .padding(.top, 4)
                    
                    // Preparation time
                    HStack(spacing: 6) {
                        Image(systemName: "clock")
                            .foregroundColor(.gray)
                            .font(.caption)
                        Text("\(dish.preparationTime) min")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    .padding(.top, 4)
                }
                
                Spacer(minLength: 0)
            }
            
            // Action buttons
            HStack(spacing: 12) {
                Button(action: {
                    showDetails = true
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: "info.circle")
                        Text("Détails")
                    }
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.blue)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(8)
                }
                
                Spacer()
                
                Button(action: {
                    showAddToCart = true
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: "plus.circle.fill")
                        Text("Ajouter")
                    }
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    .background(Color.orange)
                    .cornerRadius(10)
                }
            }
            .padding(.top, 12)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 16)
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.08), radius: 4, x: 0, y: 2)
        .sheet(isPresented: $showAddToCart) {
            AddToCartView(
                dish: dish,
                quantity: $quantity,
                specialInstructions: $specialInstructions,
                onAddToCart: onAddToCart
            )
        }
        .sheet(isPresented: $showDetails) {
            DishDetailView(dish: dish)
        }
    }
}

struct AddToCartView: View {
    let dish: Dish
    @Binding var quantity: Int
    @Binding var specialInstructions: String
    let onAddToCart: (Int, String?) -> Void
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                // Dish info
                HStack(spacing: 16) {
                    AsyncImage(url: URL(string: "https://picsum.photos/80/80?random=\(dish.id.uuidString.prefix(8))")) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(Color.gray.opacity(0.3))
                    }
                    .frame(width: 60, height: 60)
                    .cornerRadius(10)
                    .clipped()
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text(dish.name)
                            .font(.headline)
                            .fontWeight(.semibold)
                        Text(dish.formattedPrice)
                            .font(.subheadline)
                            .foregroundColor(.orange)
                            .fontWeight(.semibold)
                    }
                    
                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
                .background(Color.gray.opacity(0.1))
                .cornerRadius(12)
                
                // Quantity selector
                VStack(alignment: .leading, spacing: 12) {
                    Text("Quantité")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    HStack(spacing: 16) {
                        Button(action: {
                            if quantity > 1 {
                                quantity -= 1
                            }
                        }) {
                            Image(systemName: "minus.circle.fill")
                                .font(.title2)
                                .foregroundColor(quantity > 1 ? .orange : .gray)
                        }
                        .disabled(quantity <= 1)
                        
                        Text("\(quantity)")
                            .font(.title2)
                            .fontWeight(.bold)
                            .frame(minWidth: 40)
                        
                        Button(action: {
                            quantity += 1
                        }) {
                            Image(systemName: "plus.circle.fill")
                                .font(.title2)
                                .foregroundColor(.orange)
                        }
                    }
                }
                .padding(.horizontal, 20)
                
                // Special instructions
                VStack(alignment: .leading, spacing: 12) {
                    Text("Instructions spéciales (optionnel)")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    TextField("Ex: Sans oignons, bien cuit...", text: $specialInstructions, axis: .vertical)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .lineLimit(3...6)
                }
                .padding(.horizontal, 20)
                
                Spacer()
                
                // Add to cart button
                Button(action: {
                    onAddToCart(quantity, specialInstructions.isEmpty ? nil : specialInstructions)
                    dismiss()
                }) {
                    HStack {
                        Image(systemName: "cart.badge.plus")
                        Text("Ajouter au panier")
                    }
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.orange)
                    .cornerRadius(12)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 20)
            }
            .navigationTitle("Ajouter au panier")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct DishDetailView: View {
    let dish: Dish
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Image
                    AsyncImage(url: URL(string: "https://picsum.photos/300/200?random=\(dish.id.uuidString.prefix(8))")) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(Color.gray.opacity(0.3))
                            .overlay(
                                Image(systemName: "photo")
                                    .font(.system(size: 50))
                                    .foregroundColor(.gray)
                            )
                    }
                    .frame(height: 200)
                    .cornerRadius(16)
                    .clipped()
                    
                    // Title and price
                    HStack {
                        Text(dish.name)
                            .font(.title)
                            .fontWeight(.bold)
                        
                        Spacer()
                        
                        Text(dish.formattedPrice)
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.orange)
                    }
                    
                    // Description
                    Text(dish.description)
                        .font(.body)
                        .foregroundColor(.secondary)
                        .lineSpacing(4)
                    
                    // Details
                    VStack(alignment: .leading, spacing: 16) {
                        DetailRow(icon: "clock", title: "Temps de préparation", value: "\(dish.preparationTime) minutes")
                        
                        if !dish.allergens.isEmpty {
                            DetailRow(icon: "exclamationmark.triangle", title: "Allergènes", value: dish.allergens.joined(separator: ", "))
                        }
                        
                        if dish.isVegetarian {
                            DetailRow(icon: "leaf", title: "Type", value: "Végétarien")
                        }
                        
                        if dish.isGlutenFree {
                            DetailRow(icon: "checkmark.circle", title: "Sans gluten", value: "Oui")
                        }
                        
                        if dish.isSpicy {
                            DetailRow(icon: "flame", title: "Épicé", value: "Oui")
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 20)
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(16)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 40)
            }
            .navigationTitle("Détails")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct DetailRow: View {
    let icon: String
    let title: String
    let value: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.orange)
                .font(.system(size: 16))
                .frame(width: 20)
            
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
            
            Spacer()
            
            Text(value)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }
}

#Preview {
    DishRow(
        dish: Dish(
            name: "Couscous Royal",
            description: "Couscous traditionnel avec légumes, viande et merguez",
            price: 15.99,
            imageName: "couscous",
            category: "Plats principaux",
            allergens: ["Gluten"],
            isAvailable: true,
            preparationTime: 25,
            calories: 450,
            isVegetarian: false,
            isGlutenFree: false,
            isSpicy: false
        ),
        onAddToCart: { _, _ in }
    )
    .padding()
}