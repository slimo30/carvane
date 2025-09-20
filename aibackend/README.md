# Carvane AI Backend

A comprehensive AI-powered backend service for restaurant management with integrated payment processing and agentic AI capabilities.

## Features

### 🤖 Agentic AI Integration
- **LangGraph-powered AI agents** for intelligent conversation handling
- **Multi-task AI capabilities**: Payment processing, recipe assistance, general conversation
- **Context-aware responses** based on user intent and restaurant context
- **Conversation management** with persistent chat history

### 💳 Chargily Payment Integration
- **Complete Chargily API integration** for Algerian payment processing
- **Multiple payment methods**: EDAHABIA, CIB, and more
- **Webhook handling** for real-time payment status updates
- **Payment tracking and management** with comprehensive status monitoring

### 🏗️ Architecture
- **FastAPI** for high-performance API development
- **MongoDB with Beanie** for document-based data storage
- **MinIO** for file storage and management
- **Async/await** throughout for optimal performance
- **Type safety** with Pydantic models

## Quick Start

### Prerequisites
- Python 3.11+
- MongoDB
- MinIO (optional, for file storage)
- OpenAI API key
- Chargily API credentials

### Installation

1. **Clone and navigate to the project:**
```bash
cd aibackend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

5. **Run the application:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB Configuration
MONGODB_URL=mongodb://root:example@mongodb:27017
MONGODB_DATABASE=carvane_ai

# MinIO Configuration
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Chargily Configuration
CHARGILY_API_KEY=your_chargily_api_key_here
CHARGILY_SECRET_KEY=your_chargily_secret_key_here
CHARGILY_BASE_URL=https://pay.chargily.com/test/v2
CHARGILY_WEBHOOK_SECRET=your_webhook_secret_here

# Application Configuration
APP_NAME=Carvane AI Backend
DEBUG=true
HOST=0.0.0.0
PORT=8001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## API Endpoints

### AI Agent Endpoints (`/api/ai/`)

- `POST /api/ai/chat` - Chat with the AI agent
- `GET /api/ai/conversations` - List conversations
- `POST /api/ai/conversations` - Create new conversation
- `GET /api/ai/conversations/{id}` - Get conversation details
- `GET /api/ai/conversations/{id}/messages` - Get conversation messages
- `GET /api/ai/health` - AI service health check

### Payment Endpoints (`/api/payments/`)

- `POST /api/payments/` - Create new payment
- `GET /api/payments/{id}` - Get payment details
- `GET /api/payments/` - List payments with filters
- `PUT /api/payments/{id}` - Update payment
- `POST /api/payments/{id}/cancel` - Cancel payment
- `GET /api/payments/{id}/status` - Get payment status
- `GET /api/payments/{id}/chargily-url` - Get Chargily payment URL
- `POST /api/payments/webhook` - Chargily webhook handler

## Usage Examples

### Chat with AI Agent

```python
import httpx

# Chat with the AI agent
response = await httpx.post("http://localhost:8001/api/ai/chat", json={
    "message": "Je veux créer un paiement de 1500 DZD pour la table 5",
    "user_id": "user123",
    "restaurant_id": "restaurant456"
})

print(response.json())
# {
#   "response": "Parfait ! Je vais créer un paiement de 1500.0 DZD via Chargily...",
#   "conversation_id": "conv_1234567890",
#   "message_id": "msg_1234567890",
#   "timestamp": "2024-01-01T12:00:00Z"
# }
```

### Create Payment

```python
# Create a new payment
response = await httpx.post("http://localhost:8001/api/payments/", json={
    "amount": 1500.0,
    "currency": "DZD",
    "method": "chargily",
    "user_id": "user123",
    "restaurant_id": "restaurant456",
    "table_id": "T-5",
    "description": "Paiement pour commande table 5"
})

payment = response.json()
print(f"Payment created: {payment['id']}")
print(f"Chargily URL: {payment['chargily_payment_url']}")
```

### Check Payment Status

```python
# Check payment status
response = await httpx.get(f"http://localhost:8001/api/payments/{payment_id}/status")
status = response.json()
print(f"Payment status: {status['status']}")
```

## AI Agent Capabilities

The AI agent can handle multiple types of requests:

### Payment Processing
- **Natural language payment requests**: "Je veux payer 1000 DZD par carte"
- **Payment method selection**: Automatically detects preferred payment method
- **Table identification**: Extracts table numbers from conversation
- **Payment status tracking**: Monitors and reports payment status

### Recipe Assistance
- **Cooking guidance**: Provides step-by-step cooking instructions
- **Ingredient help**: Suggests alternatives and quantities
- **Technique advice**: Explains cooking methods and tips
- **Recipe recommendations**: Suggests dishes based on available ingredients

### General Conversation
- **Restaurant operations**: Answers questions about restaurant processes
- **Customer service**: Handles general inquiries and support
- **Multi-language support**: Primarily French with English support

## Payment Integration

### Chargily Integration Features

1. **Payment Creation**: Automatically creates Chargily invoices
2. **Webhook Processing**: Real-time payment status updates
3. **Multiple Payment Methods**: EDAHABIA, CIB, and other Algerian payment methods
4. **Security**: HMAC signature verification for webhooks
5. **Error Handling**: Comprehensive error handling and retry logic

### Payment Flow

1. **Payment Request**: User requests payment via AI agent or API
2. **Chargily Invoice**: System creates Chargily payment invoice
3. **Payment URL**: User receives payment URL for completion
4. **Webhook Processing**: Chargily sends status updates via webhooks
5. **Status Update**: Payment status is updated in real-time

## Development

### Project Structure

```
aibackend/
├── src/
│   ├── models/           # Pydantic models and Beanie documents
│   │   ├── conversation.py
│   │   └── payament.py
│   ├── services/         # Business logic services
│   │   ├── ai_agent_service.py
│   │   └── chargily_service.py
│   ├── router/           # FastAPI routers
│   │   ├── ai_agent_router.py
│   │   └── payment_router.py
│   ├── exception.py      # Custom exceptions
│   └── utils.py          # Utility functions
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

### Adding New Features

1. **New AI Capabilities**: Extend the `AIAgentService` class
2. **New Payment Methods**: Add to the `ChargilyService` class
3. **New API Endpoints**: Create new routers in the `router/` directory
4. **New Data Models**: Add to the `models/` directory

### Testing

```bash
# Run tests (when implemented)
pytest

# Run with coverage
pytest --cov=src
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Environment Setup

1. **Production Environment Variables**: Set all required environment variables
2. **Database Setup**: Ensure MongoDB is properly configured
3. **Chargily Configuration**: Set up production Chargily credentials
4. **Webhook URLs**: Configure production webhook endpoints

## Security Considerations

- **API Key Management**: Store sensitive keys in environment variables
- **Webhook Security**: Verify Chargily webhook signatures
- **CORS Configuration**: Properly configure allowed origins
- **Input Validation**: All inputs are validated using Pydantic models
- **Error Handling**: Sensitive information is not exposed in error messages

## Monitoring and Logging

- **Health Checks**: Built-in health check endpoints
- **Error Tracking**: Comprehensive error handling and logging
- **Performance Monitoring**: Async operations for optimal performance
- **Database Monitoring**: MongoDB connection and query monitoring

## Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review the logs for error details
3. Verify environment variable configuration
4. Test with the health check endpoints

## License

This project is part of the Carvane restaurant management system.
