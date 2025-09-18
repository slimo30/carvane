//
//  PromoBanner.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct PromoBanner: View {
    let promo: Promo
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Image(systemName: promoIcon)
                        .foregroundColor(.white)
                        .font(.caption)
                    
                    Text(promo.name)
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                }
                
                Text(promo.description)
                    .font(.caption2)
                    .foregroundColor(.white.opacity(0.9))
                    .lineLimit(2)
            }
            
            Spacer()
            
            VStack(alignment: .trailing) {
                Text(promo.formattedValue)
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                if promo.type == .percentage {
                    Text("de réduction")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.9))
                }
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(promoBackgroundColor)
        .cornerRadius(8)
        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
    
    private var promoIcon: String {
        switch promo.type {
        case .percentage:
            return "percent"
        case .fixedAmount:
            return "banknote"
        case .buyOneGetOne:
            return "gift"
        case .happyHour:
            return "clock"
        case .loyalty:
            return "star"
        case .antiWaste:
            return "leaf"
        }
    }
    
    private var promoBackgroundColor: Color {
        switch promo.type {
        case .percentage:
            return .blue
        case .fixedAmount:
            return .green
        case .buyOneGetOne:
            return .purple
        case .happyHour:
            return .orange
        case .loyalty:
            return .yellow
        case .antiWaste:
            return .mint
        }
    }
}

struct PromosView: View {
    @ObservedObject var cartViewModel: CartViewModel
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                if cartViewModel.availablePromos.isEmpty {
                    emptyPromosView
                } else {
                    promosListView
                }
            }
            .navigationTitle("Promotions")
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
    
    private var emptyPromosView: some View {
        VStack(spacing: 20) {
            Image(systemName: "tag")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            
            Text("Aucune promotion disponible")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(.gray)
            
            Text("Revenez plus tard pour découvrir nos offres spéciales")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var promosListView: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(cartViewModel.availablePromos) { promo in
                    PromoCard(
                        promo: promo,
                        isApplied: cartViewModel.appliedPromos.contains { $0.id == promo.id },
                        onApply: {
                            cartViewModel.applyPromo(promo)
                        },
                        onRemove: {
                            cartViewModel.removePromo(promo)
                        }
                    )
                }
            }
            .padding()
        }
    }
}

struct PromoCard: View {
    let promo: Promo
    let isApplied: Bool
    let onApply: () -> Void
    let onRemove: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Image(systemName: promoIcon)
                    .foregroundColor(promoColor)
                    .font(.title2)
                
                VStack(alignment: .leading) {
                    Text(promo.name)
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    Text(promo.code)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(4)
                }
                
                Spacer()
                
                VStack(alignment: .trailing) {
                    Text(promo.formattedValue)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(promoColor)
                    
                    if promo.type == .percentage {
                        Text("de réduction")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // Description
            Text(promo.description)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            // Conditions
            if let minimumAmount = promo.minimumOrderAmount {
                HStack {
                    Image(systemName: "info.circle")
                        .foregroundColor(.blue)
                        .font(.caption)
                    
                    Text("Commande minimum: \(String(format: "%.0f DA", minimumAmount))")
                        .font(.caption)
                        .foregroundColor(.blue)
                }
            }
            
            if !promo.applicableCategories.isEmpty {
                HStack {
                    Image(systemName: "tag")
                        .foregroundColor(.green)
                        .font(.caption)
                    
                    Text("Catégories: \(promo.applicableCategories.joined(separator: ", "))")
                        .font(.caption)
                        .foregroundColor(.green)
                }
            }
            
            // Validity
            HStack {
                Image(systemName: "calendar")
                    .foregroundColor(.orange)
                    .font(.caption)
                
                Text("Valide jusqu'au \(promo.validUntil?.formatted(date: .abbreviated, time: .omitted) ?? "indéfiniment")")
                    .font(.caption)
                    .foregroundColor(.orange)
            }
            
            // Action button
            Button(action: {
                if isApplied {
                    onRemove()
                } else {
                    onApply()
                }
            }) {
                HStack {
                    Image(systemName: isApplied ? "checkmark" : "plus")
                    Text(isApplied ? "Appliquée" : "Appliquer")
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(isApplied ? Color.green : promoColor)
                .cornerRadius(8)
            }
            .disabled(!promo.isCurrentlyValid)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(isApplied ? Color.green : Color.clear, lineWidth: 2)
        )
    }
    
    private var promoIcon: String {
        switch promo.type {
        case .percentage:
            return "percent"
        case .fixedAmount:
            return "banknote"
        case .buyOneGetOne:
            return "gift"
        case .happyHour:
            return "clock"
        case .loyalty:
            return "star"
        case .antiWaste:
            return "leaf"
        }
    }
    
    private var promoColor: Color {
        switch promo.type {
        case .percentage:
            return .blue
        case .fixedAmount:
            return .green
        case .buyOneGetOne:
            return .purple
        case .happyHour:
            return .orange
        case .loyalty:
            return .yellow
        case .antiWaste:
            return .mint
        }
    }
}

#Preview {
    PromoBanner(promo: Promo.samplePromos[0])
}
