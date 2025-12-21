from faster_whisper import WhisperModel
import sys

audio_path = sys.argv[1]

model = WhisperModel( "small",
    device="cpu",
    compute_type="int8")

segments, info = model.transcribe(audio_path)

final_text = ""
for segment in segments:
    final_text += segment.text + " "

print(final_text.strip())   # 🔥 THIS LINE IS CRITICAL
