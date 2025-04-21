from flask import Blueprint, request, Response,jsonify
import os
from google.cloud import translate_v2 as translate
from google.cloud import texttospeech
from routes.config import GOOGLE_APPLICATION_CREDENTIALS
import re

tts_bp = Blueprint('tts', __name__)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_APPLICATION_CREDENTIALS

translate_client = translate.Client()
tts_client = texttospeech.TextToSpeechClient()

@tts_bp.route('/speak', methods=['POST'])
def speak():
    data = request.get_json()
    text = data['text']
    lang_code = data['lang']  # 'kn', 'hi', 'en', 'ml'

    # Optional: translate text
    result = translate_client.translate(text, target_language=lang_code)
    translated_text = result['translatedText']

    # Text input for synthesis
    synthesis_input = texttospeech.SynthesisInput(text=translated_text)

    # Voice configuration
    voice = texttospeech.VoiceSelectionParams(
        language_code=f"{lang_code}-IN",
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
    )

    # Audio config with speaking speed (default = 1.0, slower = <1.0, faster = >1.0)
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=0.8  # 🐢 Slower (try 1.2 for faster)
    )

    # Synthesize speech
    response = tts_client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    return Response(response.audio_content, mimetype="audio/mpeg")



# Supported languages
supported_languages = {
    "kan": "kn",  # Kannada
    "hin": "hi",  # Hindi
    "mal": "ml",  # Malayalam
    "tamil": "ta", # Tamil
    "en": "en"    # English
}

@tts_bp.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get('text', '')
    target_lang = data.get('target', 'en')  # Default to English if not specified

    # Check if the target language is supported
    if target_lang not in supported_languages:
        return jsonify({'error': 'Language not supported'}), 400

    # Translate the text using Google Cloud Translate API
    try:
        result = translate_client.translate(text, target_language=supported_languages[target_lang])
        return jsonify({'translated': result['translatedText']})
    except Exception as e:
        return jsonify({'error': f'Translation failed: {str(e)}'}), 500


@tts_bp.route('/fill-form', methods=['POST'])
def fill_form():
    data = request.get_json()
    transcript = data.get('transcript', '')

    # ✨ Dummy NLP logic (you can replace with spaCy, transformers etc.)
    name_match = re.search(r"(my name is|I am)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)", transcript, re.IGNORECASE)
    dob_match = re.search(r"born on (\d{4}-\d{2}-\d{2})", transcript)
    contact_match = re.search(r"contact number is (\d{10})", transcript)

    form_data = {
        "fullname": name_match.group(2) if name_match else "",
        "dob": dob_match.group(1) if dob_match else "",
        "contact": contact_match.group(1) if contact_match else "",
    }

    return jsonify(form_data)
