//
//  QRScannerView.swift
//  mobile
//
//  Created by omar on 18/9/2025.
//

import SwiftUI
import AVFoundation

struct QRScannerView: View {
    @StateObject private var viewModel = QRScannerViewModel()
    @Binding var isPresented: Bool
    let onTableScanned: (String) -> Void
    @State private var scannedTableNumber: String?
    @State private var showMenu = false
    
    var body: some View {
        ZStack {
            // Camera view
            QRScannerRepresentable(
                onCodeScanned: { code in
                    scannedTableNumber = code
                    onTableScanned(code)
                    isPresented = false
                }
            )
            .ignoresSafeArea()
            
            // Overlay UI
            VStack {
                // Top section
                HStack {
                    Button("Annuler") {
                        isPresented = false
                    }
                    .foregroundColor(.white)
                    .padding()
                    .background(Color.black.opacity(0.6))
                    .cornerRadius(10)
                    
                    Spacer()
                }
                .padding()
                
                Spacer()
                
                // Center scanning area
                VStack(spacing: 20) {
                    Image(systemName: "qrcode.viewfinder")
                        .font(.system(size: 60))
                        .foregroundColor(.white)
                    
                    Text("Scannez le QR code sur votre table")
                        .font(.headline)
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                    
                    Text("Table #\(scannedTableNumber ?? "?")")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.yellow)
                        .opacity(scannedTableNumber != nil ? 1 : 0)
                }
                .padding()
                .background(Color.black.opacity(0.7))
                .cornerRadius(20)
                .padding()
                
                Spacer()
                
                // Bottom instructions
                VStack(spacing: 10) {
                    Text("Instructions:")
                        .font(.headline)
                        .foregroundColor(.white)
                    
                    Text("• Placez le QR code dans le cadre")
                        .font(.subheadline)
                        .foregroundColor(.white)
                    
                    Text("• Attendez la confirmation")
                        .font(.subheadline)
                        .foregroundColor(.white)
                }
                .padding()
                .background(Color.black.opacity(0.6))
                .cornerRadius(15)
                .padding()
            }
        }
        .sheet(isPresented: $showMenu) {
            if let tableNumber = scannedTableNumber {
                MenuView(tableNumber: tableNumber)
            }
        }
    }
}

struct QRScannerRepresentable: UIViewRepresentable {
    let onCodeScanned: (String) -> Void
    
    func makeUIView(context: Context) -> QRScannerUIView {
        let scannerView = QRScannerUIView()
        scannerView.onCodeScanned = onCodeScanned
        return scannerView
    }
    
    func updateUIView(_ uiView: QRScannerUIView, context: Context) {}
}

class QRScannerUIView: UIView {
    var onCodeScanned: ((String) -> Void)?
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupCamera()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupCamera()
    }
    
    private func setupCamera() {
        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else { return }
        
        let videoInput: AVCaptureDeviceInput
        
        do {
            videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
        } catch {
            return
        }
        
        captureSession = AVCaptureSession()
        captureSession?.addInput(videoInput)
        
        let metadataOutput = AVCaptureMetadataOutput()
        captureSession?.addOutput(metadataOutput)
        
        metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
        metadataOutput.metadataObjectTypes = [.qr]
        
        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession!)
        previewLayer?.frame = layer.bounds
        previewLayer?.videoGravity = .resizeAspectFill
        layer.addSublayer(previewLayer!)
        
        DispatchQueue.global(qos: .background).async {
            self.captureSession?.startRunning()
        }
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        previewLayer?.frame = layer.bounds
    }
}

extension QRScannerUIView: AVCaptureMetadataOutputObjectsDelegate {
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if let metadataObject = metadataObjects.first {
            guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject else { return }
            guard let stringValue = readableObject.stringValue else { return }
            
            // Simulate table number extraction
            let tableNumber = extractTableNumber(from: stringValue)
            onCodeScanned?(tableNumber)
        }
    }
    
    private func extractTableNumber(from qrString: String) -> String {
        // In a real app, this would parse the QR code data
        // For demo purposes, we'll simulate different table numbers
        let tableNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        return tableNumbers.randomElement() ?? "1"
    }
}

class QRScannerViewModel: ObservableObject {
    @Published var isScanning = false
    @Published var scannedCode: String?
    @Published var errorMessage: String?
    
    func startScanning() {
        isScanning = true
        errorMessage = nil
    }
    
    func stopScanning() {
        isScanning = false
    }
}
