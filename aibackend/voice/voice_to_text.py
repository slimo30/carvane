# import whisper
# import sounddevice as sd
# import soundfile as sf  # <-- à ajouter
# import numpy as np

# # Charger le modèle
# model = whisper.load_model("base")

# samplerate = 16000
# duration = 5

# print("🎤 Enregistrement en temps réel...")

# while True:
#     audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype="float32")
#     sd.wait()
    
#     audio = np.squeeze(audio)
#     audio_path = "chunk.wav"
#     sf.write(audio_path, audio, samplerate)  # ✅ soundfile.write
    
#     result = model.transcribe(audio_path, task="translate")
#     print("➡️", result["text"])
from fastapi import FastAPI, UploadFile, File
import whisper
import uvicorn
import tempfile

app = FastAPI()
model = whisper.load_model("base")

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # save to temp wav
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    
    result = model.transcribe(tmp_path, task="translate")
    return {"text": result["text"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
