import SwiftUI

struct PaymentView: View {
    @StateObject var viewModel = PaymentViewModel()
    
    var body: some View {
        VStack {
            if viewModel.isPaid {
                Text("✅ Payment Successful!")
                    .font(.largeTitle)
            } else {
                Button("Tap to Pay (NFC Mock)") {
                    viewModel.simulateNFCPayment()
                }
                .padding()
            }
        }
        .navigationTitle("Payment")
    }
}

