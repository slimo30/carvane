# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.middleware.cors import CORSMiddleware
# import aiohttp
# import asyncio
# import json
# import logging
# from typing import Optional
# import base64
# from pydantic import BaseModel
# import urllib.parse

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(title="Real-time TTS Streaming API")

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class TTSRequest(BaseModel):
#     text: str
#     voice: Optional[str] = "jennifer"
#     format: Optional[str] = "mp3"

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: list[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)
#         logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

#     def disconnect(self, websocket: WebSocket):
#         if websocket in self.active_connections:
#             self.active_connections.remove(websocket)
#         logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

#     async def send_audio_chunk(self, websocket: WebSocket, chunk: bytes):
#         """Send audio chunk as base64 encoded data"""
#         try:
#             encoded_chunk = base64.b64encode(chunk).decode('utf-8')
#             message = {
#                 "type": "audio_chunk",
#                 "data": encoded_chunk,
#                 "chunk_size": len(chunk)
#             }
#             await websocket.send_text(json.dumps(message))
#         except WebSocketDisconnect:
#             logger.info("WebSocket disconnected during audio chunk send")
#             self.disconnect(websocket)
#             raise
#         except Exception as e:
#             logger.error(f"Error sending audio chunk: {e}")

#     async def send_message(self, websocket: WebSocket, message: dict):
#         """Send control messages"""
#         try:
#             await websocket.send_text(json.dumps(message))
#         except WebSocketDisconnect:
#             logger.info("WebSocket disconnected during message send")
#             self.disconnect(websocket)
#             raise
#         except Exception as e:
#             logger.error(f"Error sending message: {e}")

# manager = ConnectionManager()

# async def stream_real_tts(text: str, websocket: WebSocket, voice: str = "en", format: str = "mp3"):
#     """
#     Stream real TTS audio using multiple fallback services
#     1. Try Google Translate TTS (free, no API key)
#     2. Fallback to Edge TTS (Microsoft, free)
#     3. Generate test audio as last resort
#     """
    
#     try:
#         await manager.send_message(websocket, {
#             "type": "stream_start",
#             "message": f"Starting TTS for: {text[:50]}..."
#         })

#         # Method 1: Google Translate TTS (Free)
#         success = await try_google_tts(text, websocket)
#         if success:
#             return

#         # Method 2: Try alternative free TTS service
#         success = await try_alternative_tts(text, websocket)
#         if success:
#             return

#         # Method 3: Fallback to test audio
#         await generate_test_audio(websocket, text)
        
#     except Exception as e:
#         logger.error(f"TTS streaming error: {e}")
#         await manager.send_message(websocket, {
#             "type": "error",
#             "message": f"TTS error: {str(e)}"
#         })

# async def try_google_tts(text: str, websocket: WebSocket) -> bool:
#     """Try Google Translate TTS - free service"""
#     try:
#         # Limit text length and encode for URL
#         text_limited = text[:200]
#         encoded_text = urllib.parse.quote(text_limited)
        
#         # Google Translate TTS URL
#         tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&q={encoded_text}&tl=en&total=1&idx=0"
        
#         headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
#         }
        
#         async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30)) as session:
#             async with session.get(tts_url, headers=headers) as response:
#                 if response.status == 200:
#                     # Read and stream audio data
#                     audio_data = await response.read()
                    
#                     if len(audio_data) > 100:  # Valid audio data
#                         chunk_size = 4096
#                         total_chunks = 0
                        
#                         for i in range(0, len(audio_data), chunk_size):
#                             chunk = audio_data[i:i + chunk_size]
#                             await manager.send_audio_chunk(websocket, chunk)
#                             total_chunks += 1
#                             await asyncio.sleep(0.01)
                        
#                         await manager.send_message(websocket, {
#                             "type": "stream_complete",
#                             "message": f"Google TTS completed. Sent {total_chunks} chunks.",
#                             "audio_format": "mp3",
#                             "total_bytes": len(audio_data),
#                             "provider": "Google Translate TTS"
#                         })
#                         return True
                        
#     except Exception as e:
#         logger.error(f"Google TTS failed: {e}")
    
#     return False

# async def try_alternative_tts(text: str, websocket: WebSocket) -> bool:
#     """Try alternative TTS service (Mock for now - you can add real services)"""
#     try:
#         # This is a placeholder for additional TTS services
#         # You could add services like:
#         # - ResponsiveVoice API (free tier)
#         # - IBM Watson TTS (free tier)
#         # - Amazon Polly (free tier)
        
#         await manager.send_message(websocket, {
#             "type": "info",
#             "message": "Alternative TTS services not configured. Falling back to test audio."
#         })
#         return False
        
#     except Exception as e:
#         logger.error(f"Alternative TTS failed: {e}")
    
#     return False

# async def generate_test_audio(websocket: WebSocket, text: str):
#     """Generate simple test audio when TTS services fail"""
#     try:
#         await manager.send_message(websocket, {
#             "type": "stream_start",
#             "message": "Generating test audio beeps (TTS services unavailable)..."
#         })
        
#         # Generate simple beep pattern based on text length
#         import math
#         import struct
        
#         # Audio parameters
#         sample_rate = 22050
#         duration = min(5.0, max(1.0, len(text) * 0.05))  # 1-5 seconds based on text
        
#         # Generate beep pattern
#         samples = []
#         beep_count = min(5, max(1, len(text.split())))  # Number of beeps based on words
        
#         for beep in range(beep_count):
#             # Each beep: 0.2 seconds tone + 0.1 seconds silence
#             beep_duration = 0.2
#             silence_duration = 0.1
#             frequency = 440 + (beep * 110)  # Different frequency for each beep
            
#             # Generate beep
#             for i in range(int(sample_rate * beep_duration)):
#                 t = float(i) / sample_rate
#                 amplitude = 0.3 * math.sin(2 * math.pi * frequency * t)
                
#                 # Fade in/out
#                 fade_samples = int(sample_rate * 0.01)  # 10ms fade
#                 if i < fade_samples:
#                     amplitude *= i / fade_samples
#                 elif i > int(sample_rate * beep_duration) - fade_samples:
#                     amplitude *= (int(sample_rate * beep_duration) - i) / fade_samples
                
#                 sample = int(amplitude * 32767)
#                 samples.append(struct.pack('<h', sample))
            
#             # Add silence
#             for i in range(int(sample_rate * silence_duration)):
#                 samples.append(struct.pack('<h', 0))
        
#         # Create WAV file
#         audio_data = b''.join(samples)
#         wav_header = create_wav_header(len(audio_data), sample_rate)
#         full_audio = wav_header + audio_data
        
#         # Stream audio in chunks
#         chunk_size = 4096
#         total_chunks = 0
        
#         for i in range(0, len(full_audio), chunk_size):
#             chunk = full_audio[i:i + chunk_size]
#             await manager.send_audio_chunk(websocket, chunk)
#             total_chunks += 1
#             await asyncio.sleep(0.05)  # Slower streaming for test audio
        
#         await manager.send_message(websocket, {
#             "type": "stream_complete",
#             "message": f"Test audio completed ({beep_count} beeps). Sent {total_chunks} chunks.",
#             "audio_format": "wav",
#             "total_bytes": len(full_audio),
#             "provider": "Test Audio Generator",
#             "note": "Configure TTS API keys for real speech synthesis"
#         })
        
#     except Exception as e:
#         logger.error(f"Test audio generation error: {e}")
#         await manager.send_message(websocket, {
#             "type": "error",
#             "message": f"Failed to generate test audio: {str(e)}"
#         })

# def create_wav_header(data_length: int, sample_rate: int = 22050):
#     """Create WAV file header"""
#     import struct
    
#     header = b'RIFF'
#     header += struct.pack('<I', data_length + 36)
#     header += b'WAVE'
#     header += b'fmt '
#     header += struct.pack('<I', 16)  # Subchunk1 size
#     header += struct.pack('<H', 1)   # Audio format (PCM)
#     header += struct.pack('<H', 1)   # Num channels (mono)
#     header += struct.pack('<I', sample_rate)
#     header += struct.pack('<I', sample_rate * 2)
#     header += struct.pack('<H', 2)   # Block align
#     header += struct.pack('<H', 16)  # Bits per sample
#     header += b'data'
#     header += struct.pack('<I', data_length)
    
#     return header

# @app.websocket("/ws/tts")
# async def websocket_tts_endpoint(websocket: WebSocket):
#     await manager.connect(websocket)
    
#     try:
#         while True:
#             data = await websocket.receive_text()
#             message = json.loads(data)
            
#             if message.get("type") == "tts_request":
#                 text = message.get("text", "").strip()
#                 voice = message.get("voice", "en")
#                 format = message.get("format", "mp3")
                
#                 if not text:
#                     await manager.send_message(websocket, {
#                         "type": "error",
#                         "message": "Text is required for TTS"
#                     })
#                     continue
                
#                 logger.info(f"Processing TTS request: {text[:50]}...")
                
#                 # Stream TTS audio
#                 await stream_real_tts(text, websocket, voice, format)
                    
#             elif message.get("type") == "ping":
#                 await manager.send_message(websocket, {
#                     "type": "pong",
#                     "message": "Connection is alive"
#                 })
                
#             else:
#                 await manager.send_message(websocket, {
#                     "type": "error",
#                     "message": f"Unknown message type: {message.get('type')}"
#                 })
                
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#         logger.info("Client disconnected")
#     except json.JSONDecodeError as e:
#         logger.error(f"JSON decode error: {e}")
#         try:
#             await manager.send_message(websocket, {
#                 "type": "error",
#                 "message": "Invalid JSON format"
#             })
#         except:
#             pass
#         manager.disconnect(websocket)
#     except Exception as e:
#         logger.error(f"WebSocket error: {e}")
#         try:
#             await manager.send_message(websocket, {
#                 "type": "error",
#                 "message": f"Server error: {str(e)}"
#             })
#         except:
#             pass
#         manager.disconnect(websocket)

# @app.get("/health")
# async def health_check():
#     return {
#         "status": "healthy",
#         "active_connections": len(manager.active_connections),
#         "tts_providers": [
#             "Google Translate TTS (free)",
#             "Test Audio Generator (fallback)"
#         ]
#     }

# @app.get("/")
# async def root():
#     return {
#         "message": "Real-time TTS Streaming API",
#         "websocket_endpoint": "/ws/tts",
#         "usage": {
#             "connect": "ws://localhost:8000/ws/tts",
#             "send": {
#                 "type": "tts_request",
#                 "text": "Hello world",
#                 "voice": "en",
#                 "format": "mp3"
#             }
#         },
#         "features": [
#             "Real-time text-to-speech streaming",
#             "Free Google Translate TTS",
#             "Fallback test audio generation",
#             "No API keys required"
#         ],
#         "note": "VAPI doesn't provide direct TTS streaming - it's for voice assistants. This API uses free TTS services."
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         app,
#         host="0.0.0.0",
#         port=8000,
#         log_level="info"
#     )

# import requests
# import json
# import time

# class VAPITester:
#     def __init__(self, api_key):
#         self.api_key = api_key
#         self.base_url = "https://api.vapi.ai"
#         self.headers = {
#             'Authorization': f'Bearer {api_key}',
#             'Content-Type': 'application/json'
#         }
#         # Your existing assistant details
#         self.assistant_id = "fbd48279-9088-4daa-93f2-6a22bf9540e8"
    
#     def test_assistant_exists(self):
#         """Test if your assistant exists and get its details"""
#         print("🔍 Testing if assistant exists...")
        
#         try:
#             response = requests.get(
#                 f"{self.base_url}/assistant/{self.assistant_id}",
#                 headers=self.headers
#             )
            
#             if response.status_code == 200:
#                 assistant = response.json()
#                 print("✅ Assistant found!")
#                 print(f"   Name: {assistant.get('name')}")
#                 print(f"   Voice: {assistant.get('voice', {}).get('voiceId')} ({assistant.get('voice', {}).get('provider')})")
#                 print(f"   First Message: {assistant.get('firstMessage')}")
#                 print(f"   Created: {assistant.get('createdAt')}")
#                 return True
#             else:
#                 print(f"❌ Assistant not found: {response.status_code}")
#                 print(f"   Response: {response.text}")
#                 return False
                
#         except Exception as e:
#             print(f"❌ Error checking assistant: {e}")
#             return False
    
#     def update_assistant_text(self, new_text):
#         """Update the assistant's first message"""
#         print(f"📝 Updating assistant message to: '{new_text}'")
        
#         update_data = {
#             "firstMessage": new_text
#         }
        
#         try:
#             response = requests.patch(
#                 f"{self.base_url}/assistant/{self.assistant_id}",
#                 headers=self.headers,
#                 json=update_data
#             )
            
#             if response.status_code == 200:
#                 print("✅ Assistant message updated successfully!")
#                 return True
#             else:
#                 print(f"❌ Failed to update assistant: {response.status_code}")
#                 print(f"   Response: {response.text}")
#                 return False
                
#         except Exception as e:
#             print(f"❌ Error updating assistant: {e}")
#             return False
    
#     def test_outbound_call(self, phone_number):
#         """Test making an outbound call (requires valid phone number)"""
#         print(f"📞 Testing outbound call to: {phone_number}")
        
#         call_data = {
#             "type": "outboundPhoneCall",
#             "assistantId": self.assistant_id,
#             "customer": {
#                 "number": phone_number
#             }
#         }
        
#         try:
#             response = requests.post(
#                 f"{self.base_url}/call",
#                 headers=self.headers,
#                 json=call_data
#             )
            
#             if response.status_code in [200, 201]:
#                 call = response.json()
#                 print("✅ Outbound call created!")
#                 print(f"   Call ID: {call.get('id')}")
#                 print(f"   Status: {call.get('status')}")
#                 return call.get('id')
#             else:
#                 print(f"❌ Failed to create call: {response.status_code}")
#                 print(f"   Response: {response.text}")
#                 return None
                
#         except Exception as e:
#             print(f"❌ Error creating call: {e}")
#             return None
    
#     def get_call_status(self, call_id):
#         """Get status of a call"""
#         print(f"📊 Getting call status for: {call_id}")
        
#         try:
#             response = requests.get(
#                 f"{self.base_url}/call/{call_id}",
#                 headers=self.headers
#             )
            
#             if response.status_code == 200:
#                 call = response.json()
#                 print("✅ Call status retrieved!")
#                 print(f"   Status: {call.get('status')}")
#                 print(f"   Duration: {call.get('duration')} seconds")
#                 print(f"   Cost: ${call.get('cost', 0)}")
#                 return call
#             else:
#                 print(f"❌ Failed to get call status: {response.status_code}")
#                 return None
                
#         except Exception as e:
#             print(f"❌ Error getting call status: {e}")
#             return None
    
#     def list_recent_calls(self):
#         """List recent calls"""
#         print("📋 Listing recent calls...")
        
#         try:
#             response = requests.get(
#                 f"{self.base_url}/call",
#                 headers=self.headers
#             )
            
#             if response.status_code == 200:
#                 calls = response.json()
#                 if calls:
#                     print(f"✅ Found {len(calls)} recent calls:")
#                     for i, call in enumerate(calls[:5], 1):
#                         print(f"   {i}. ID: {call.get('id')[:8]}... | Status: {call.get('status')} | Duration: {call.get('duration')}s")
#                 else:
#                     print("   No calls found")
#                 return calls
#             else:
#                 print(f"❌ Failed to list calls: {response.status_code}")
#                 return None
                
#         except Exception as e:
#             print(f"❌ Error listing calls: {e}")
#             return None
    
#     def full_test(self, test_text, phone_number=None):
#         """Run complete test suite"""
#         print("=" * 60)
#         print("🧪 VAPI API FULL TEST SUITE")
#         print("=" * 60)
        
#         # Test 1: Check if assistant exists
#         if not self.test_assistant_exists():
#             print("❌ Assistant test failed. Stopping.")
#             return False
        
#         print("\n" + "-" * 40)
        
#         # Test 2: Update assistant message
#         if not self.update_assistant_text(test_text):
#             print("❌ Update test failed. Stopping.")
#             return False
        
#         print("\n" + "-" * 40)
        
#         # Test 3: List recent calls
#         self.list_recent_calls()
        
#         # Test 4: Make call (only if phone number provided)
#         if phone_number:
#             print("\n" + "-" * 40)
#             call_id = self.test_outbound_call(phone_number)
            
#             if call_id:
#                 print("\n⏱️  Waiting 10 seconds for call to start...")
#                 time.sleep(10)
                
#                 # Check call status
#                 print("\n" + "-" * 40)
#                 self.get_call_status(call_id)
#         else:
#             print("\n💡 Tip: Provide a phone number to test outbound calls")
        
#         print("\n" + "=" * 60)
#         print("✅ Test suite completed!")
#         print("=" * 60)
        
#         return True

# # Example usage
# if __name__ == "__main__":
#     # Your VAPI API key
#     API_KEY = "eee7f90c-328f-42b5-9f71-b542fc9457f0"
    
#     # Create tester
#     tester = VAPITester(API_KEY)
    
#     # Text you want the assistant to speak
#     test_message = "Hello! This is a test message from Python. I am your VAPI assistant named Poli, and I'm speaking with Elliot voice."
    
#     # Run full test (without phone call)
#     tester.full_test(test_message)
    
#     # Uncomment below to test with phone call (replace with real number)
#     # tester.full_test(test_message, phone_number="+1234567890")
    
#     print("\n🎯 NEXT STEPS:")
#     print("1. Check if assistant was updated")
#     print("2. Use Web SDK to hear the voice in browser")
#     print("3. Or provide phone number to test actual calls")
    
#     # Quick individual tests
#     print("\n" + "=" * 60)
#     print("🔧 INDIVIDUAL TEST FUNCTIONS:")
#     print("=" * 60)
    
#     # Test individual functions
#     print("\n1. Testing assistant exists:")
#     tester.test_assistant_exists()
    
#     print("\n2. Testing update message:")
#     tester.update_assistant_text("Quick test message hhhhhhhom Python!")
    
#     print("\n3. Testing list calls:")
#     calls = tester.list_recent_calls()

# # Quick test functions for copy-paste usage
# def quick_test_assistant(api_key="eee7f90c-328f-42b5-9f71-b542fc9457f0"):
#     """Quick function to test if assistant exists"""
#     headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
#     response = requests.get("https://api.vapi.ai/assistant/fbd48279-9088-4daa-93f2-6a22bf9540e8", headers=headers)
#     return response.status_code == 200, response.json() if response.status_code == 200 else response.text

# def quick_update_message(text, api_key="eee7f90c-328f-42b5-9f71-b542fc9457f0"):
#     """Quick function to update assistant message"""
#     headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
#     data = {"firstMessage": text}
#     response = requests.patch("https://api.vapi.ai/assistant/fbd48279-9088-4daa-93f2-6a22bf9540e8", headers=headers, json=data)
#     return response.status_code == 200, response.json() if response.status_code == 200 else response.text

# # Usage examples:
# # success, result = quick_test_assistant()
# # success, result = quick_update_message("New message!")

# from fastapi import FastAPI
# from fastapi.responses import FileResponse
# from google.cloud import texttospeech
# from google.oauth2 import service_account
# import os

# app = FastAPI(title="Google Cloud TTS Test")

# # Load credentials
# CREDENTIALS_PATH = "bakeitauth-a364a1327a16.json"  # your JSON file
# if not os.path.exists(CREDENTIALS_PATH):
#     raise FileNotFoundError(f"Missing credentials file: {CREDENTIALS_PATH}")

# credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)
# client = texttospeech.TextToSpeechClient(credentials=credentials)


# @app.get("/")
# async def root():
#     return {"message": "Google Cloud TTS API test is working!"}


# @app.get("/speak")
# async def speak(text: str = "Hello, this is a Google TTS test."):
#     """Convert text to speech and return an MP3 file."""
#     synthesis_input = texttospeech.SynthesisInput(text=text)

#     voice = texttospeech.VoiceSelectionParams(
#         language_code="en-US",
#         name="en-US-Standard-A"
#     )

#     audio_config = texttospeech.AudioConfig(
#         audio_encoding=texttospeech.AudioEncoding.MP3
#     )

#     response = client.synthesize_speech(
#         input=synthesis_input,
#         voice=voice,
#         audio_config=audio_config
#     )

#     # Save MP3
#     filename = "output.mp3"
#     with open(filename, "wb") as out:
#         out.write(response.audio_content)

#     return FileResponse(filename, media_type="audio/mpeg", filename="tts.mp3")


# @app.get("/voices")
# async def list_voices():
#     """List available Google Cloud voices."""
#     voices = client.list_voices()
#     return [
#         {"name": v.name, "language": v.language_codes, "gender": v.ssml_gender.name}
#         for v in voices.voices[:20]
#     ]


# if __name__ == "__main__":
#     # 🔹 Run one test immediately with random text
#     test_text = "Hello Slimane, your Google Cloud Text to Speech API is working perfectly!"
#     synthesis_input = texttospeech.SynthesisInput(text=test_text)
#     voice = texttospeech.VoiceSelectionParams(
#         language_code="en-US",
#         name="en-US-Standard-A"
#     )
#     audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

#     response = client.synthesize_speech(
#         input=synthesis_input, voice=voice, audio_config=audio_config
#     )

#     with open("test_output.mp3", "wb") as out:
#         out.write(response.audio_content)

#     print("✅ Test TTS generated: test_output.mp3")

#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google.cloud import texttospeech
from google.oauth2 import service_account
import asyncio
import json
import io
import os
from typing import Dict, Set

app = FastAPI(title="Real-time TTS Streaming")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load credentials
CREDENTIALS_PATH = "bakeitauth-a364a1327a16.json"

if not os.path.exists(CREDENTIALS_PATH):
    raise FileNotFoundError(f"Missing credentials file: {CREDENTIALS_PATH}")

credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)
client = texttospeech.TextToSpeechClient(credentials=credentials)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def send_audio(self, websocket: WebSocket, audio_data: bytes):
        try:
            await websocket.send_bytes(audio_data)
        except:
            self.disconnect(websocket)

manager = ConnectionManager()

def synthesize_speech_stream(text: str, voice_name: str = "en-US-Standard-A", language_code: str = "en-US"):
    """Convert text to speech and return audio bytes"""
    synthesis_input = texttospeech.SynthesisInput(text=text)
    
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        name=voice_name
    )
    
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=1.0,
        pitch=0.0
    )
    
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
    
    return response.audio_content

@app.get("/")
async def root():
    return {"message": "Real-time TTS API is running!"}

@app.get("/stream-tts")
async def stream_tts(text: str, voice: str = "en-US-Standard-A", lang: str = "en-US"):
    """Stream TTS audio directly without saving to file"""
    def generate_audio():
        try:
            audio_content = synthesize_speech_stream(text, voice, lang)
            yield audio_content
        except Exception as e:
            print(f"Error generating audio: {e}")
            yield b""
    
    return StreamingResponse(
        generate_audio(),
        media_type="audio/mpeg",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )

@app.websocket("/ws/tts")
async def websocket_tts_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time TTS streaming"""
    await manager.connect(websocket)
    print("WebSocket connected")
    
    try:
        while True:
            # Receive text from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            text = message.get("text", "")
            voice = message.get("voice", "en-US-Standard-A")
            language = message.get("language", "en-US")
            
            if text.strip():
                print(f"Converting to speech: {text[:50]}...")
                
                # Generate audio
                try:
                    audio_content = synthesize_speech_stream(text, voice, language)
                    
                    # Send audio back to client
                    await manager.send_audio(websocket, audio_content)
                    print("Audio sent successfully")
                    
                except Exception as e:
                    error_msg = {"error": f"TTS generation failed: {str(e)}"}
                    await websocket.send_text(json.dumps(error_msg))
                    print(f"Error: {e}")
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

@app.get("/voices")
async def list_voices():
    """List available Google Cloud voices"""
    voices = client.list_voices()
    return [
        {
            "name": v.name, 
            "language": v.language_codes[0], 
            "gender": v.ssml_gender.name
        }
        for v in voices.voices[:50]
    ]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "real-time-tts"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Real-time TTS Server...")
    print("📡 WebSocket endpoint: ws://localhost:8000/ws/tts")
    print("🔊 HTTP streaming endpoint: http://localhost:8000/stream-tts?text=your_text")
    uvicorn.run(app, host="0.0.0.0", port=8000)