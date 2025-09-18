
import Foundation

class CartViewModel: ObservableObject {
    @Published var items: [Dish] = []
    
    func add(_ dish: Dish) {
        items.append(dish)
    }
    
    func remove(_ dish: Dish) {
        items.removeAll { $0.id == dish.id }
    }
    
    var total: Double {
        items.reduce(0) { $0 + $1.price }
    }
}
