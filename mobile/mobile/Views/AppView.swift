//
//  AppView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct AppView: View {
    @StateObject private var appStateManager = AppStateManager()
    @State private var tableNumber = "1" // Default table number for demo
    
    var body: some View {
        ZStack {
            switch appStateManager.currentState {
            case .splash:
                SplashView()
                    .environmentObject(appStateManager)
                
            case .onboarding:
                OnboardingView()
                    .environmentObject(appStateManager)
                
            case .login:
                LoginView()
                    .environmentObject(appStateManager)
                
            case .main:
                MenuView(tableNumber: tableNumber)
                    .environmentObject(appStateManager)
            }
        }
        .animation(.easeInOut(duration: 0.5), value: appStateManager.currentState)
    }
}

#Preview {
    AppView()
}