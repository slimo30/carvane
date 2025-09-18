//
//  VoiceAgentViewModel.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import Foundation
import Combine
import AVFoundation

struct ChatMessage: Identifiable {
    let id = UUID()
    let content: String
    let isFromUser: Bool
    let timestamp: Date
    let messageType: MessageType
    
    enum MessageType {
        case text
        case suggestion
        case dishRecommendation
        case allergenInfo
    }
}

class VoiceAgentViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var isActive = true
    @Published var isTyping = false
    @Published var isListening = false
    @Published var quickActions: [String] = []
    
    private let speechSynthesizer = AVSpeechSynthesizer()
    private var recognitionTimer: Timer?
    
    init() {
        setupQuickActions()
    }
    
    func startConversation() {
        let welcomeMessage = ChatMessage(
            content: "Bonjour! Je suis votre assistant vocal. Je peux vous aider à choisir des plats, répondre à vos questions sur les allergènes, et vous donner des recommandations. Comment puis-je vous aider?",
            isFromUser: false,
            timestamp: Date(),
            messageType: .text
        )
        messages.append(welcomeMessage)
        speakText(welcomeMessage.content)
    }
    
    func sendMessage(_ text: String) {
        let userMessage = ChatMessage(
            content: text,
            isFromUser: true,
            timestamp: Date(),
            messageType: .text
        )
        messages.append(userMessage)
        
        // Simulate processing
        isTyping = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.processMessage(text)
        }
    }
    
    func startListening() {
        isListening = true
        // In a real app, this would start speech recognition
        simulateVoiceInput()
    }
    
    func stopListening() {
        isListening = false
        recognitionTimer?.invalidate()
    }
    
    private func processMessage(_ text: String) {
        isTyping = false
        
        let response = generateResponse(for: text)
        let responseMessage = ChatMessage(
            content: response,
            isFromUser: false,
            timestamp: Date(),
            messageType: .text
        )
        
        messages.append(responseMessage)
        speakText(response)
    }
    
    private func generateResponse(for input: String) -> String {
        let lowercaseInput = input.lowercased()
        
        // Allergen queries
        if lowercaseInput.contains("allergène") || lowercaseInput.contains("allergie") {
            return "Je peux vous aider avec les informations sur les allergènes. Les plats marqués avec un triangle rouge contiennent des allergènes. Voulez-vous que je vous montre les plats sans gluten, sans lactose, ou végétariens?"
        }
        
        // Gluten-free queries
        if lowercaseInput.contains("gluten") || lowercaseInput.contains("sans gluten") {
            return "Voici nos plats sans gluten: Tajine de Poulet, Poulet Grillé. Ces plats ne contiennent pas de gluten et sont parfaits pour les personnes intolérantes."
        }
        
        // Vegetarian queries
        if lowercaseInput.contains("végétarien") || lowercaseInput.contains("végétarien") {
            return "Nous avons plusieurs options végétariennes: Salade César, Pizza Margherita. Ces plats sont délicieux et 100% végétariens."
        }
        
        // Spicy food queries
        if lowercaseInput.contains("épicé") || lowercaseInput.contains("piquant") {
            return "Actuellement, nous n'avons pas de plats très épicés au menu, mais je peux vous recommander des plats avec des saveurs marquées comme le Couscous Royal ou le Tajine de Poulet."
        }
        
        // Price queries
        if lowercaseInput.contains("prix") || lowercaseInput.contains("cher") || lowercaseInput.contains("coût") {
            return "Nos prix varient de 650 DA à 1200 DA. Les plats les plus abordables sont la Salade César (650 DA) et la Pizza Margherita (800 DA). Voulez-vous des recommandations selon votre budget?"
        }
        
        // Recommendation queries
        if lowercaseInput.contains("recommand") || lowercaseInput.contains("suggère") || lowercaseInput.contains("conseil") {
            return "Je recommande le Couscous Royal (1200 DA) - c'est notre spécialité traditionnelle, ou le Tajine de Poulet (950 DA) pour une expérience authentique. Qu'est-ce qui vous tente le plus?"
        }
        
        // Preparation time queries
        if lowercaseInput.contains("temps") || lowercaseInput.contains("préparation") || lowercaseInput.contains("attendre") {
            return "Les temps de préparation varient de 10 à 30 minutes. Les salades sont les plus rapides (10 min), tandis que les plats traditionnels prennent 25-30 minutes. Voulez-vous quelque chose de rapide?"
        }
        
        // General help
        if lowercaseInput.contains("aide") || lowercaseInput.contains("help") {
            return "Je peux vous aider avec: les informations sur les allergènes, les recommandations de plats, les prix, les temps de préparation, et répondre à toutes vos questions sur le menu. Que souhaitez-vous savoir?"
        }
        
        // Default response
        return "Merci pour votre question. Je peux vous aider avec les informations sur les plats, les allergènes, les prix, et les recommandations. Pouvez-vous être plus spécifique sur ce que vous cherchez?"
    }
    
    private func speakText(_ text: String) {
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "fr-FR")
        utterance.rate = 0.5
        speechSynthesizer.speak(utterance)
    }
    
    private func simulateVoiceInput() {
        // Simulate voice recognition with random responses
        let sampleInputs = [
            "Quels sont les plats sans gluten?",
            "Je veux quelque chose de végétarien",
            "Quel est le plat le moins cher?",
            "Que me recommandez-vous?",
            "Y a-t-il des plats épicés?",
            "Combien de temps pour la préparation?"
        ]
        
        recognitionTimer = Timer.scheduledTimer(withTimeInterval: 3.0, repeats: false) { _ in
            let randomInput = sampleInputs.randomElement() ?? "Aide-moi avec le menu"
            self.sendMessage(randomInput)
            self.isListening = false
        }
    }
    
    private func setupQuickActions() {
        quickActions = [
            "Plats sans gluten",
            "Options végétariennes",
            "Recommandations",
            "Prix abordables",
            "Temps de préparation"
        ]
    }
}
