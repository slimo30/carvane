import Foundation

class PaymentViewModel: ObservableObject {
    @Published var isPaid = false
    
    func simulateNFCPayment() {
        //dok ndblha b nfc ta3 sa7 
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.isPaid = true
        }
    }
}

