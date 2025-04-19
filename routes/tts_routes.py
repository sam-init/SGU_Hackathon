from flask import Blueprint, request, Response
import os
from google.cloud import translate_v2 as translate
from google.cloud import texttospeech

tts_bp = Blueprint('tts', __name__)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "durable-kingdom-456901-u8-db29a531aa4f.json"

translate_client = translate.Client()
tts_client = texttospeech.TextToSpeechClient()

@tts_bp.route('/speak', methods=['POST'])
def speak():
    data = request.get_json()
    text = data['text']
    lang_code = data['lang']  # 'kn', 'hi', 'en', 'ml'

    # Translate text (optional step, based on language selection)
    result = translate_client.translate(text, target_language=lang_code)
    translated_text = result['translatedText']

    # Set up the text-to-speech configuration
    synthesis_input = texttospeech.SynthesisInput(text=translated_text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=f"{lang_code}-IN",  # Assuming you are working with Indian languages
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
    )
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

    # Generate speech from the text
    response = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    # Return the audio content directly as a response
    return Response(response.audio_content, mimetype="audio/mpeg")
