import Foundation

class SplitBillViewModel: ObservableObject {
    @Published var totalAmount: Double
    @Published var numberOfPeople: Int = 1
    @Published var splitAmounts: [Double] = []
    
    init(total: Double) {
        self.totalAmount = total
        self.splitAmounts = [total]
    }
    
    func splitEqually() {
        guard numberOfPeople > 0 else { return }
        let share = totalAmount / Double(numberOfPeople)
        splitAmounts = Array(repeating: share, count: numberOfPeople)
    }
}

