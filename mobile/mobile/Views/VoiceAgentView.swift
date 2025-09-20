//
//  VoiceAgentView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI
import AVFoundation
import Vapi

struct VoiceAgentView: View {
    @ObservedObject var viewModel: VoiceAgentViewModel
    @State private var vapi: Vapi?
    @State private var userInput = ""
    @State private var isListening = false
    @State private var isCallActive = false
    @State private var isMuted = false
    @State private var callStatus = "Ready to start call"
    
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
            initializeVapi()
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
            
            // Call status
            Text(callStatus)
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.horizontal)
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
                    if isCallActive {
                        stopCall()
                    } else {
                        Task {
                            await startCall()
                        }
                    }
                }) {
                    HStack {
                        Image(systemName: isCallActive ? "phone.down.fill" : "phone.fill")
                            .font(.title2)
                        Text(isCallActive ? "End Call" : "Start Call")
                            .font(.headline)
                    }
                    .foregroundColor(.white)
                    .padding()
                    .background(isCallActive ? Color.red : Color.orange)
                    .cornerRadius(25)
                }
                .disabled(!viewModel.isActive)
                
                // Mute button (only show when call is active)
                if isCallActive {
                    Button(action: {
                        Task {
                            await toggleMute()
                        }
                    }) {
                        Image(systemName: isMuted ? "mic.slash.fill" : "mic.fill")
                            .font(.title2)
                            .foregroundColor(isMuted ? .red : .blue)
                            .padding()
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(25)
                    }
                }
                
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
    
    // MARK: - Vapi Methods
    
    private func initializeVapi() {
        // Initialize Vapi with configuration
        // Option 1: Try with API key directly in configuration
        do {
            let configJSON = """
            {
                "apiKey": "a35edcb1-d7a1-4c3e-bf74-e1d20245a47c"
            }
            """
            
            let configData = configJSON.data(using: .utf8)!
            let decoder = JSONDecoder()
            let configuration = try decoder.decode(Vapi.Configuration.self, from: configData)
            vapi = Vapi(configuration: configuration)
            
            callStatus = "Vapi initialized successfully"
        } catch {
            print("Failed to initialize Vapi: \(error)")
            callStatus = "Failed to initialize Vapi: \(error.localizedDescription)"
            
            // Option 2: Try alternative initialization if available
            // Sometimes SDKs have multiple initializers
            // vapi = Vapi() // uncomment this line if the above fails
        }
    }
    
    private func startCall() async {
        guard let vapi = vapi else {
            await MainActor.run {
                self.callStatus = "Vapi not initialized"
            }
            return
        }
        
        do {
            await MainActor.run {
                self.callStatus = "Starting call..."
            }
            
            // Replace "your-assistant-id" with your actual assistant ID from Vapi dashboard
            try await vapi.start(assistantId: "your-assistant-id")
            
            await MainActor.run {
                self.isCallActive = true
                self.callStatus = "Call started successfully"
            }
            
        } catch {
            await MainActor.run {
                self.callStatus = "Failed to start call: \(error.localizedDescription)"
                self.isCallActive = false
            }
        }
    }
    
    private func stopCall() {
        guard let vapi = vapi else { return }
        
        callStatus = "Ending call..."
        
        Task {
            await vapi.stop()
            
            await MainActor.run {
                self.isCallActive = false
                self.callStatus = "Call ended"
                self.isMuted = false
            }
        }
    }
    
    private func toggleMute() async {
        guard let vapi = vapi, isCallActive else { return }
        
        let newMuteState = !isMuted
        
        do {
            try await vapi.setMuted(newMuteState)
            await MainActor.run {
                self.isMuted = newMuteState
                self.callStatus = newMuteState ? "Muted" : "Unmuted"
            }
        } catch {
            await MainActor.run {
                self.callStatus = "Failed to toggle mute: \(error.localizedDescription)"
            }
        }
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
