import sounddevice as sd
import numpy as np
import requests
import io
import soundfile as sf

SERVER_URL = "http://localhost:8000/transcribe"
samplerate = 16000
duration = 5  # seconds per chunk

print("🎤 Recording & sending in real-time...")

while True:
    # record chunk
    audio = sd.rec(int(duration * samplerate), samplerate=samplerate,
                   channels=1, dtype="float32")
    sd.wait()
    audio = np.squeeze(audio)

    # write to in-memory buffer (not file)
    buf = io.BytesIO()
    sf.write(buf, audio, samplerate, format="WAV")
    buf.seek(0)

    # send to server
    files = {"file": ("chunk.wav", buf, "audio/wav")}
    try:
        response = requests.post(SERVER_URL, files=files)
        if response.status_code == 200:
            print("➡️", response.json().get("text", ""))
        else:
            print("❌ Server error:", response.status_code)
    except Exception as e:
        print("⚠️ Error:", e)
