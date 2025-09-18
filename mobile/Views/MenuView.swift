import SwiftUI

struct MenuView: View {
    @StateObject var cart = CartViewModel()
    @StateObject var menu = MenuViewModel()
    
    var body: some View {
        NavigationView {
            List(menu.dishes) { dish in
                HStack {
                    Text(dish.name)
                    Spacer()
                    Text("\(dish.price, specifier: "%.0f") DA")
                    Button("Add") {
                        cart.add(dish)
                    }
                }
            }
            .navigationTitle("Menu")
            .toolbar {
                NavigationLink("Cart") {
                    CartView(cart: cart)
                }
            }
        }
    }
}

