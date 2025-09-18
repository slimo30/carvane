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
            HStack(alignment: .top, spacing: 12) {
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
                .frame(width: 80, height: 80)
                .cornerRadius(12)
                .clipped()
                
                // Dish Info
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(dish.name)
                            .font(.headline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
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
                    
                    // Allergens and badges
                    HStack(spacing: 8) {
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
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.green.opacity(0.2))
                                .foregroundColor(.green)
                                .cornerRadius(4)
                        }
                        
                        if dish.isGlutenFree {
                            Text("Sans gluten")
                                .font(.caption)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.blue.opacity(0.2))
                                .foregroundColor(.blue)
                                .cornerRadius(4)
                        }
                        
                        if dish.isSpicy {
                            Text("Épicé")
                                .font(.caption)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.red.opacity(0.2))
                                .foregroundColor(.red)
                                .cornerRadius(4)
                        }
                    }
                    
                    // Preparation time
                    HStack(spacing: 4) {
                        Image(systemName: "clock")
                            .foregroundColor(.gray)
                            .font(.caption)
                        Text("\(dish.preparationTime) min")
                            .font(.caption)
                            .foregroundColor(.gray)
                        
                        if let calories = dish.calories {
                            Text("•")
                                .foregroundColor(.gray)
                            Text("\(calories) cal")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    }
                }
                
                // Add to cart button
                Button(action: {
                    showAddToCart = true
                }) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                        .foregroundColor(.orange)
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
        }
        .sheet(isPresented: $showAddToCart) {
            AddToCartSheet(
                dish: dish,
                quantity: $quantity,
                specialInstructions: $specialInstructions,
                onAddToCart: { qty, instructions in
                    onAddToCart(qty, instructions)
                    showAddToCart = false
                }
            )
        }
        .onTapGesture {
            showDetails = true
        }
        .sheet(isPresented: $showDetails) {
            DishDetailView(dish: dish)
        }
    }
}

struct AddToCartSheet: View {
    let dish: Dish
    @Binding var quantity: Int
    @Binding var specialInstructions: String
    let onAddToCart: (Int, String?) -> Void
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Dish info
                HStack {
                    AsyncImage(url: URL(string: "https://picsum.photos/80/80?random=\(dish.id.uuidString.prefix(8))")) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(Color.gray.opacity(0.3))
                    }
                    .frame(width: 60, height: 60)
                    .cornerRadius(8)
                    
                    VStack(alignment: .leading) {
                        Text(dish.name)
                            .font(.headline)
                        Text(dish.formattedPrice)
                            .font(.subheadline)
                            .foregroundColor(.orange)
                    }
                    
                    Spacer()
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(12)
                
                // Quantity selector
                VStack(alignment: .leading, spacing: 8) {
                    Text("Quantité")
                        .font(.headline)
                    
                    HStack {
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
                            .fontWeight(.semibold)
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
                
                // Special instructions
                VStack(alignment: .leading, spacing: 8) {
                    Text("Instructions spéciales (optionnel)")
                        .font(.headline)
                    
                    TextField("Ex: Sans oignons, bien cuit...", text: $specialInstructions)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                }
                
                Spacer()
                
                // Add to cart button
                Button(action: {
                    onAddToCart(quantity, specialInstructions.isEmpty ? nil : specialInstructions)
                }) {
                    HStack {
                        Image(systemName: "cart.fill")
                        Text("Ajouter au panier - \(String(format: "%.2f DA", dish.price * Double(quantity)))")
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
            .navigationTitle("Ajouter au panier")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("Annuler") {
                    dismiss()
                }
            )
        }
    }
}

struct DishDetailView: View {
    let dish: Dish
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
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
                                    .foregroundColor(.gray)
                            )
                    }
                    .frame(height: 200)
                    .cornerRadius(12)
                    
                    // Name and price
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
                    
                    // Details
                    VStack(alignment: .leading, spacing: 12) {
                        DetailRow(icon: "clock", title: "Temps de préparation", value: "\(dish.preparationTime) minutes")
                        
                        if let calories = dish.calories {
                            DetailRow(icon: "flame", title: "Calories", value: "\(calories) cal")
                        }
                        
                        DetailRow(icon: "tag", title: "Catégorie", value: dish.category)
                        
                        if !dish.allergens.isEmpty {
                            DetailRow(icon: "exclamationmark.triangle", title: "Allergènes", value: dish.allergens.joined(separator: ", "))
                        }
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                }
                .padding()
            }
            .navigationTitle("Détails")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                trailing: Button("Fermer") {
                    dismiss()
                }
            )
        }
    }
}

struct DetailRow: View {
    let icon: String
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(.orange)
                .frame(width: 20)
            
            Text(title)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
        }
    }
}

#Preview {
    DishRow(
        dish: Dish.sampleDishes[0],
        onAddToCart: { _, _ in }
    )
}
