
struct Order {
    var dishes: [Dish]
    
    var total: Double {
        dishes.reduce(0) { $0 + $1.price }
    }
}
