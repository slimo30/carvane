//
//  AppView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI

struct AppView: View {
    @StateObject private var appStateManager = AppStateManager()
    
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
                MainRestaurantView()
                    .environmentObject(appStateManager)
            }
        }
        .animation(.easeInOut(duration: 0.5), value: appStateManager.currentState)
    }
}

#Preview {
    AppView()
}
