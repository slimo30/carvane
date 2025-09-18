struct Promo {
    let code: String
    let discountPercentage: Double
    func apply(to amount:Double) -> Double{
        return amount * (1 - discountPercentage/100)
    }
 
}

