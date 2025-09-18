import Foundation

struct Dish: Identifiable {
    let id = UUID()
    let name: String
    let price: Double
    let allergens: [String]
    let imageName: String?
}
