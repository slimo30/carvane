import SwiftUI

struct CartView: View {
    @ObservedObject var cart: CartViewModel
    
    var body: some View {
        VStack {
            List {
                ForEach(cart.items) { dish in
                    Text(dish.name)
                }
            }
            Text("Total: \(cart.total, specifier: "%.0f") DA")
                .bold()
            
            NavigationLink("Split Bill") {
                SplitBillView(total: cart.total)
            }
            .padding()
        }
        .navigationTitle("Cart")
    }
}
