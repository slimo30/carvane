import Foundation

class MenuViewModel: ObservableObject {
    @Published var dishes: [Dish] = [
        Dish(name: "Pizza Margherita", price: 1200, allergens: ["gluten"], imageName: "wail"),
        Dish(name: "Couscous", price: 900, allergens: [], imageName: "wail"),
        Dish(name: "Salad", price: 500, allergens: ["nuts"],imageName:"wail")
    ]
}
