//
//  VoiceAgentView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI
import AVFoundation

struct VoiceAgentView: View {
    @ObservedObject var viewModel: VoiceAgentViewModel
    @State private var userInput = ""
    @State private var isListening = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header
                headerView
                
                // Chat messages
                chatMessagesView
                
                // Input area
                inputArea
            }
            .navigationTitle("Assistant Vocal")
            .navigationBarTitleDisplayMode(.inline)
        }
        .onAppear {
            viewModel.startConversation()
        }
    }
    
    private var headerView: some View {
        VStack(spacing: 12) {
            // Voice agent avatar
            HStack {
                Image(systemName: "person.circle.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.orange)
                
                VStack(alignment: .leading) {
                    Text("Assistant Caravane")
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    Text("Je peux vous aider avec le menu et vos questions")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // Status indicator
                HStack {
                    Circle()
                        .fill(viewModel.isActive ? .green : .gray)
                        .frame(width: 8, height: 8)
                    Text(viewModel.isActive ? "En ligne" : "Hors ligne")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            
            // Quick actions
            quickActionsView
        }
    }
    
    private var quickActionsView: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(viewModel.quickActions, id: \.self) { action in
                    Button(action: {
                        viewModel.sendMessage(action)
                    }) {
                        Text(action)
                            .font(.caption)
                            .fontWeight(.medium)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.orange.opacity(0.1))
                            .foregroundColor(.orange)
                            .cornerRadius(15)
                    }
                }
            }
            .padding(.horizontal)
        }
    }
    
    private var chatMessagesView: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(viewModel.messages) { message in
                        ChatMessageView(message: message)
                            .id(message.id)
                    }
                    
                    if viewModel.isTyping {
                        TypingIndicatorView()
                    }
                }
                .padding()
            }
            .onChange(of: viewModel.messages.count) { _ in
                if let lastMessage = viewModel.messages.last {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        proxy.scrollTo(lastMessage.id, anchor: .bottom)
                    }
                }
            }
        }
    }
    
    private var inputArea: some View {
        VStack(spacing: 12) {
            // Voice input button
            HStack {
                Button(action: {
                    if isListening {
                        viewModel.stopListening()
                    } else {
                        viewModel.startListening()
                    }
                    isListening.toggle()
                }) {
                    HStack {
                        Image(systemName: isListening ? "stop.circle.fill" : "mic.circle.fill")
                            .font(.title2)
                        Text(isListening ? "Arrêter" : "Parler")
                            .font(.headline)
                    }
                    .foregroundColor(.white)
                    .padding()
                    .background(isListening ? Color.red : Color.orange)
                    .cornerRadius(25)
                }
                .disabled(!viewModel.isActive)
                
                Spacer()
                
                // Text input
                HStack {
                    TextField("Tapez votre message...", text: $userInput)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .onSubmit {
                            if !userInput.isEmpty {
                                viewModel.sendMessage(userInput)
                                userInput = ""
                            }
                        }
                    
                    Button(action: {
                        if !userInput.isEmpty {
                            viewModel.sendMessage(userInput)
                            userInput = ""
                        }
                    }) {
                        Image(systemName: "paperplane.fill")
                            .foregroundColor(.orange)
                    }
                    .disabled(userInput.isEmpty)
                }
            }
            .padding()
        }
        .background(Color(.systemBackground))
    }
}

struct ChatMessageView: View {
    let message: ChatMessage
    
    var body: some View {
        HStack {
            if message.isFromUser {
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text(message.content)
                        .font(.body)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.orange)
                        .cornerRadius(20, corners: [.topLeft, .topRight, .bottomLeft])
                    
                    Text(message.timestamp, style: .time)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            } else {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .foregroundColor(.orange)
                            .font(.caption)
                        
                        Text("Assistant")
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundColor(.secondary)
                    }
                    
                    Text(message.content)
                        .font(.body)
                        .foregroundColor(.primary)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(20, corners: [.topLeft, .topRight, .bottomRight])
                    
                    Text(message.timestamp, style: .time)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
        }
    }
}

struct TypingIndicatorView: View {
    @State private var animationOffset: CGFloat = 0
    
    var body: some View {
        HStack {
            HStack(spacing: 4) {
                ForEach(0..<3) { index in
                    Circle()
                        .fill(Color.gray)
                        .frame(width: 6, height: 6)
                        .offset(y: animationOffset)
                        .animation(
                            Animation.easeInOut(duration: 0.6)
                                .repeatForever()
                                .delay(Double(index) * 0.2),
                            value: animationOffset
                        )
                }
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(20, corners: [.topLeft, .topRight, .bottomRight])
            
            Spacer()
        }
        .onAppear {
            animationOffset = -4
        }
    }
}

// Extension for custom corner radius
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}

#Preview {
    VoiceAgentView(viewModel: VoiceAgentViewModel())
}
