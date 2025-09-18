# Caravane Mobile App

A SwiftUI mobile application for the Caravane restaurant digital ordering system.

## Features

### 🎯 Core Features
- **QR Code Scanning**: Scan table QR codes to start ordering
- **Digital Menu**: Browse dishes with photos, descriptions, and allergen information
- **Voice Agent**: AI-powered assistant to answer questions about the menu
- **Auto Split Bill**: Automatically divide the bill among multiple people
- **NFC Payment**: Simulated NFC payment for quick checkout
- **Promo System**: Automatic discount application and promo management

### 🍽️ Menu Features
- Category filtering (Traditional, Salads, Pizzas, Burgers, etc.)
- Search functionality
- Allergen information display
- Preparation time and calorie information
- Special dietary indicators (Vegetarian, Gluten-free, Spicy)

### 💰 Payment Features
- Multiple payment methods (NFC, Card, Cash, Wallet)
- Automatic promo application
- Real-time total calculation
- Order confirmation and tracking

### 🗣️ Voice Agent Features
- Natural language processing for menu questions
- Allergen information queries
- Dietary restriction recommendations
- Price and preparation time inquiries
- Text-to-speech responses

## Project Structure

```
mobile/
├── Models/
│   ├── Dish.swift          # Dish data model
│   ├── Order.swift         # Order and cart models
│   ├── User.swift          # User preferences model
│   └── Promo.swift         # Promotional offers model
├── ViewModels/
│   ├── CartViewModel.swift      # Cart and promo management
│   ├── MenuViewModel.swift      # Menu filtering and search
│   ├── PaymentViewModel.swift   # Payment processing
│   ├── SplitBillViewModel.swift # Bill splitting logic
│   └── VoiceAgentViewModel.swift # Voice agent chat
├── Views/
│   ├── ContentView.swift        # Main app entry point
│   ├── QRScannerView.swift      # QR code scanning
│   ├── MenuView.swift           # Main menu interface
│   ├── DishRow.swift            # Individual dish display
│   ├── CartView.swift           # Shopping cart
│   ├── SplitBillView.swift      # Bill splitting interface
│   ├── PaymentView.swift        # Payment processing
│   ├── VoiceAgentView.swift     # Voice assistant chat
│   └── PromoBanner.swift        # Promotional offers
└── Services/
    ├── PaymentService.swift     # Payment processing service
    ├── PromoService.swift       # Promo management service
    ├── QRService.swift          # QR code handling
    └── VoiceAgentService.swift  # Voice processing service
```

## Getting Started

### Prerequisites
- Xcode 15.0+
- iOS 17.0+
- Swift 5.9+

### Installation
1. Open `mobile.xcodeproj` in Xcode
2. Select your target device or simulator
3. Build and run the project (⌘+R)

### Usage

1. **Start the App**: Launch the app to see the welcome screen
2. **Scan QR Code**: Tap "Commencer" to open the QR scanner
3. **Browse Menu**: View dishes by category or search
4. **Add to Cart**: Tap the + button on any dish
5. **Voice Assistant**: Use the microphone tab to ask questions
6. **Split Bill**: Use the cart to divide the bill among people
7. **Pay**: Complete your order with NFC or other payment methods

## Key Components

### Data Models
- **Dish**: Represents menu items with allergens, pricing, and dietary info
- **Order**: Manages cart items and order status
- **User**: Handles user preferences and dietary restrictions
- **Promo**: Manages promotional offers and discounts

### View Models
- **CartViewModel**: Manages cart state, promos, and calculations
- **MenuViewModel**: Handles menu filtering and search
- **PaymentViewModel**: Processes payment transactions
- **SplitBillViewModel**: Manages bill splitting logic
- **VoiceAgentViewModel**: Handles voice interactions

### Views
- **ContentView**: Main app entry with feature showcase
- **QRScannerView**: Camera-based QR code scanning
- **MenuView**: Tabbed interface with menu, cart, and voice agent
- **CartView**: Shopping cart with split bill options
- **PaymentView**: Payment processing with multiple methods

## Features in Detail

### Voice Agent
The voice agent can answer questions about:
- Allergen information
- Dietary restrictions (vegetarian, gluten-free)
- Price ranges and recommendations
- Preparation times
- General menu help

### Split Bill Logic
- **Equal Split**: Divides total amount equally among all people
- **By Items**: Each person pays for their selected items
- Individual payment tracking
- Real-time payment status updates

### Promo System
- Automatic promo detection and application
- Multiple promo types (percentage, fixed amount, BOGO)
- Time-based promotions (Happy Hour)
- Loyalty and anti-waste discounts

### Payment Methods
- **NFC**: Simulated contactless payment
- **Card**: Traditional card payment
- **Cash**: Cash payment option
- **Wallet**: Digital wallet integration

## Testing

The app includes sample data for testing:
- 6 sample dishes with various categories
- 4 promotional offers
- Mock payment processing
- Simulated voice responses

## Future Enhancements

- Real backend integration
- Push notifications for order status
- User accounts and order history
- Real-time order tracking
- Advanced voice recognition
- Multi-language support

## Hackathon Features

This app was built for a hackathon with focus on:
1. **Voice Agent Waiter**: AI assistant for customer questions
2. **Auto Split Bill**: Intelligent bill division
3. **NFC Auto Payment**: Contactless payment simulation
4. **Auto Reduction**: Smart discount application

## License

This project is part of the Caravane hackathon submission.
