import SwiftUI

struct SplitBillView: View {
    @StateObject var viewModel: SplitBillViewModel
    
    init(total: Double) {
        _viewModel = StateObject(wrappedValue: SplitBillViewModel(total: total))
    }
    
    var body: some View {
        VStack {
            Stepper("People: \(viewModel.numberOfPeople)", value: $viewModel.numberOfPeople, in: 1...10)
                .padding()
            
            Button("Split Equally") {
                viewModel.splitEqually()
            }
            
            List(viewModel.splitAmounts.indices, id: \.self) { i in
                Text("Person \(i+1): \(viewModel.splitAmounts[i], specifier: "%.0f") DA")
            }
        }
        .navigationTitle("Split Bill")
    }
}

