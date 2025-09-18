//
//  OnboardingView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var appStateManager: AppStateManager
    @State private var currentPage = 0
    
    let onboardingPages = [
        OnboardingPage(
            title: "Bienvenue chez Caravane",
            subtitle: "Découvrez une nouvelle expérience culinaire",
            description: "Commandez facilement, mangez délicieusement",
            imageName: "fork.knife.circle.fill",
            color: .orange
        ),
        OnboardingPage(
            title: "Commande QR",
            subtitle: "Scannez et commandez en un clic",
            description: "Plus besoin d'attendre le serveur, scannez le QR code sur votre table",
            imageName: "qrcode.viewfinder",
            color: .blue
        ),
        OnboardingPage(
            title: "Assistant Vocal",
            subtitle: "Posez vos questions sur le menu",
            description: "Notre IA vous aide à choisir selon vos préférences et allergies",
            imageName: "mic.circle.fill",
            color: .green
        ),
        OnboardingPage(
            title: "Partage d'addition",
            subtitle: "Divisez l'addition automatiquement",
            description: "Partagez facilement l'addition entre amis et famille",
            imageName: "person.2.fill",
            color: .purple
        ),
        OnboardingPage(
            title: "Paiement NFC",
            subtitle: "Payez en touchant votre téléphone",
            description: "Paiement sécurisé et instantané avec votre téléphone",
            imageName: "wave.3.right",
            color: .red
        )
    ]
    
    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                gradient: Gradient(colors: [Color.orange.opacity(0.1), Color.orange.opacity(0.05)]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Page content
                TabView(selection: $currentPage) {
                    ForEach(0..<onboardingPages.count, id: \.self) { index in
                        OnboardingPageView(page: onboardingPages[index])
                            .tag(index)
                    }
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                .animation(.easeInOut, value: currentPage)
                
                // Bottom section
                VStack(spacing: 20) {
                    // Page indicators
                    HStack(spacing: 8) {
                        ForEach(0..<onboardingPages.count, id: \.self) { index in
                            Circle()
                                .fill(index == currentPage ? Color.orange : Color.gray.opacity(0.3))
                                .frame(width: 8, height: 8)
                                .animation(.easeInOut, value: currentPage)
                        }
                    }
                    
                    // Navigation buttons
                    HStack(spacing: 16) {
                        if currentPage > 0 {
                            Button("Précédent") {
                                withAnimation {
                                    currentPage -= 1
                                }
                            }
                            .foregroundColor(.gray)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 12)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(25)
                        }
                        
                        Spacer()
                        
                        Button(currentPage == onboardingPages.count - 1 ? "Commencer" : "Suivant") {
                            if currentPage == onboardingPages.count - 1 {
                                completeOnboarding()
                            } else {
                                withAnimation {
                                    currentPage += 1
                                }
                            }
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 32)
                        .padding(.vertical, 12)
                        .background(Color.orange)
                        .cornerRadius(25)
                    }
                    .padding(.horizontal, 24)
                }
                .padding(.bottom, 50)
            }
        }
    }
    
    private func completeOnboarding() {
        appStateManager.completeOnboarding()
    }
}

struct OnboardingPage {
    let title: String
    let subtitle: String
    let description: String
    let imageName: String
    let color: Color
}

struct OnboardingPageView: View {
    let page: OnboardingPage
    @State private var isAnimating = false
    
    var body: some View {
        VStack(spacing: 40) {
            Spacer()
            
            // Icon
            Image(systemName: page.imageName)
                .font(.system(size: 100))
                .foregroundColor(page.color)
                .scaleEffect(isAnimating ? 1.0 : 0.5)
                .opacity(isAnimating ? 1.0 : 0.0)
                .animation(.spring(response: 0.8, dampingFraction: 0.6).delay(0.2), value: isAnimating)
            
            // Text content
            VStack(spacing: 16) {
                Text(page.title)
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.center)
                    .opacity(isAnimating ? 1.0 : 0.0)
                    .animation(.easeInOut(duration: 0.8).delay(0.4), value: isAnimating)
                
                Text(page.subtitle)
                    .font(.title2)
                    .foregroundColor(page.color)
                    .multilineTextAlignment(.center)
                    .opacity(isAnimating ? 1.0 : 0.0)
                    .animation(.easeInOut(duration: 0.8).delay(0.6), value: isAnimating)
                
                Text(page.description)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
                    .opacity(isAnimating ? 1.0 : 0.0)
                    .animation(.easeInOut(duration: 0.8).delay(0.8), value: isAnimating)
            }
            
            Spacer()
        }
        .onAppear {
            isAnimating = true
        }
    }
}

#Preview {
    OnboardingView()
}
