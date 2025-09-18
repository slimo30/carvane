# Caravane Mobile App Demo

## Demo Flow

### 1. App Launch
- Open the app to see the welcome screen
- Features are showcased: QR scanning, Voice agent, Split bill, NFC payment
- Tap "Commencer" to start

### 2. QR Code Scanning
- Camera opens for QR scanning
- Simulated table detection (random table numbers 1-10)
- Automatic navigation to menu after scan

### 3. Menu Browsing
- **Tab 1 - Menu**: Browse dishes by category
- **Tab 2 - Cart**: View cart and manage items
- **Tab 3 - Assistant**: Voice agent for questions

#### Menu Features:
- Category filtering (Traditional, Salads, Pizzas, etc.)
- Search functionality
- Dish details with photos, prices, allergens
- Add to cart with quantity and special instructions

### 4. Voice Agent Demo
Ask these sample questions:
- "Quels sont les plats sans gluten?"
- "Je veux quelque chose de végétarien"
- "Que me recommandez-vous?"
- "Y a-t-il des plats épicés?"
- "Combien de temps pour la préparation?"

### 5. Cart Management
- View added items with quantities
- Apply/remove promotional offers
- Split bill functionality
- Proceed to payment

### 6. Split Bill Demo
- Choose number of people (2-10)
- Select split type (Equal or By Items)
- Individual payment tracking
- Mark payments as completed

### 7. Payment Process
- Select payment method (NFC, Card, Cash, Wallet)
- Simulated payment processing
- Order confirmation with details
- Estimated preparation time

## Sample Data

### Dishes Available:
1. **Couscous Royal** - 1200 DA (Traditional, 25 min)
2. **Tajine de Poulet** - 950 DA (Traditional, 30 min, Gluten-free)
3. **Salade César** - 650 DA (Salad, 10 min, Vegetarian)
4. **Pizza Margherita** - 800 DA (Pizza, 15 min, Vegetarian)
5. **Burger Deluxe** - 1100 DA (Burger, 20 min)
6. **Poulet Grillé** - 900 DA (Grilled, 25 min, Gluten-free)

### Promotional Offers:
1. **Welcome** - 10% off first order
2. **Happy Hour** - 15% off drinks (2-4 PM)
3. **Anti-waste** - 20% off daily specials
4. **Loyalty** - 5% off for regular customers

## Key Features to Highlight

### 🎯 Voice Agent
- Natural language understanding
- Allergen information
- Dietary recommendations
- Price and time inquiries

### 💰 Auto Split Bill
- Equal division or by items
- Individual payment tracking
- Real-time status updates

### 📱 NFC Payment
- Contactless payment simulation
- Multiple payment methods
- Order confirmation

### 🏷️ Auto Promotions
- Automatic discount detection
- Multiple promo types
- Real-time calculation

## Testing Scenarios

### Scenario 1: Solo Customer
1. Scan QR → Table 5
2. Browse menu → Add Couscous Royal
3. Apply Welcome promo (10% off)
4. Pay with NFC
5. Order confirmed

### Scenario 2: Group with Split Bill
1. Scan QR → Table 3
2. Add multiple dishes
3. Split bill among 4 people
4. Each person pays individually
5. Order completed when all paid

### Scenario 3: Voice Assistant
1. Open Voice Agent tab
2. Ask "Plats sans gluten?"
3. Get recommendations
4. Add suggested dish to cart

### Scenario 4: Promo System
1. Add items to cart
2. View available promos
3. Apply multiple discounts
4. See final reduced price

## Technical Notes

- All data is simulated (no real backend)
- Payment processing is mocked
- Voice recognition is simulated
- QR scanning generates random table numbers
- Images are loaded from Picsum (placeholder service)

## Demo Tips

1. **Start with QR scanning** to show the complete flow
2. **Highlight voice agent** for innovation factor
3. **Demonstrate split bill** for group functionality
4. **Show promo system** for business value
5. **End with payment** for complete user journey

## Questions to Answer

- How does the voice agent help customers?
- What makes the split bill feature unique?
- How does the promo system work?
- What payment methods are supported?
- How does the app reduce restaurant staff workload?
