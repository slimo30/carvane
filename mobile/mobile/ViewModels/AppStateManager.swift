//
//  AppStateManager.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation
import Combine

enum AppState {
    case splash
    case onboarding
    case login
    case main
}

class AppStateManager: ObservableObject {
    @Published var currentState: AppState = .splash
    @Published var isLoggedIn: Bool = false
    @Published var hasCompletedOnboarding: Bool = false
    
    init() {
        checkInitialState()
    }
    
    private func checkInitialState() {
        // Check if user has completed onboarding
        hasCompletedOnboarding = UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")
        
        // Check if user is logged in
        isLoggedIn = UserDefaults.standard.bool(forKey: "isLoggedIn")
        
        // Determine initial state
        if !hasCompletedOnboarding {
            currentState = .onboarding
        } else if !isLoggedIn {
            currentState = .login
        } else {
            currentState = .main
        }
    }
    
    func completeOnboarding() {
        hasCompletedOnboarding = true
        UserDefaults.standard.set(true, forKey: "hasCompletedOnboarding")
        currentState = .login
    }
    
    func login() {
        isLoggedIn = true
        UserDefaults.standard.set(true, forKey: "isLoggedIn")
        currentState = .main
    }
    
    func logout() {
        isLoggedIn = false
        UserDefaults.standard.set(false, forKey: "isLoggedIn")
        currentState = .login
    }
    
    func resetApp() {
        UserDefaults.standard.removeObject(forKey: "hasCompletedOnboarding")
        UserDefaults.standard.removeObject(forKey: "isLoggedIn")
        hasCompletedOnboarding = false
        isLoggedIn = false
        currentState = .splash
    }
}
