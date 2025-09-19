import requests

BASE_URL = "http://127.0.0.1:8000"  # Your FastAPI server URL

def test_root():
    url = f"{BASE_URL}/"
    response = requests.get(url)
    print("Root:", response.status_code, response.json())

def test_health():
    url = f"{BASE_URL}/health"
    response = requests.get(url)
    print("Health:", response.status_code, response.json())

def test_initiate_payment():
    url = f"{BASE_URL}/payment/initiate"
    payload = {
        "amount": "1000000",  # Example amount
        "language": "FR"
    }
    response = requests.post(url, json=payload)
    print("Initiate Payment:", response.status_code, response.json())

def test_show_transaction():
    url = f"{BASE_URL}/payment/show"

    payload = {"order_number": "ORDER1235555"}  # Replace with a real order_number
    response = requests.post(url, json=payload)
    print("Show Transaction:", response.status_code, response.json())

def test_get_receipt():
    url = f"{BASE_URL}/payment/receipt"
    payload = {"order_number": "ORDER1235555"}  # Replace with a real order_number
    response = requests.post(url, json=payload)
    print("Get Receipt:", response.status_code, response.json())

def test_send_email_receipt():
    url = f"{BASE_URL}/payment/email"
    payload = {
        "order_number": "ORDER1235555",  # Replace with a real order_number
        "email": "example@email.com"
    }
    response = requests.post(url, json=payload)
    print("Send Email Receipt:", response.status_code, response.json())

if __name__ == "__main__":
    test_root()
    test_health()
    test_initiate_payment()
    test_show_transaction()
    test_get_receipt()
    test_send_email_receipt()
