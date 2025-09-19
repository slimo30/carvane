import asyncio
import websockets
import json
import requests
import tempfile
import os
import subprocess
import platform
import sys

class QuickTTSClient:
    def __init__(self, server_url="http://localhost:8000"):
        self.server_url = server_url
        self.ws_url = server_url.replace("http", "ws") + "/ws/tts"
    
    def http_tts(self, text, voice="en-US-Standard-A"):
        """Send text via HTTP and play audio"""
        try:
            response = requests.get(f"{self.server_url}/stream-tts", 
                                  params={"text": text, "voice": voice}, 
                                  stream=True, timeout=30)
            
            if response.status_code == 200:
                temp_file = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        temp_file.write(chunk)
                temp_file.close()
                
                print(f"✅ Audio generated: {temp_file.name}")
                self._play_audio(temp_file.name)
                return True
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    async def ws_tts(self, text, voice="en-US-Standard-A"):
        """Send text via WebSocket and play audio"""
        try:
            async with websockets.connect(self.ws_url) as websocket:
                message = {"text": text, "voice": voice, "language": "en-US"}
                await websocket.send(json.dumps(message))
                
                response = await websocket.recv()
                if isinstance(response, bytes):
                    temp_file = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
                    temp_file.write(response)
                    temp_file.close()
                    
                    print(f"✅ Audio generated: {temp_file.name}")
                    self._play_audio(temp_file.name)
                    return True
                else:
                    print(f"❌ WebSocket Error: {json.loads(response)}")
                    return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def _play_audio(self, filename):
        """Play audio file"""
        system = platform.system().lower()
        try:
            if system == "windows":
                os.startfile(filename)
            elif system == "darwin":
                subprocess.run(["afplay", filename], check=True)
            elif system == "linux":
                players = ["mpg123", "ffplay", "vlc"]
                for player in players:
                    try:
                        subprocess.run([player, filename], check=True, capture_output=True)
                        break
                    except:
                        continue
            print("🔊 Playing audio...")
        except:
            print(f"💾 Audio saved: {filename}")

def main():
    client = QuickTTSClient()
    print("🎤 TTS Client - Type 'quit' to exit")
    
    while True:
        try:
            # Get input from user
            user_input = input("\n> ").strip()
            
            if not user_input:
                continue
                
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            # Parse command: play text or just text
            if user_input.lower().startswith('play '):
                text = user_input[5:]  # Remove 'play ' prefix
            else:
                text = user_input
            
            if not text:
                print("❌ No text provided")
                continue
            
            print(f"🎤 Converting: {text}")
            
            # Try HTTP first
            if not client.http_tts(text):
                asyncio.run(client.ws_tts(text))
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()