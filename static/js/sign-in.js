async function speakText() {
            const text = document.getElementById('content').innerText;
            const lang = document.getElementById('language').value;
            
            const response = await fetch('/tts/speak', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, lang })
            });
          
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
          
            const audio = new Audio(audioUrl);
            audio.play();
          }



          document.querySelectorAll('.mic-btn').forEach((button) => {
            button.addEventListener('click', function () {
              const inputFieldId = button.getAttribute('data-input');
              const inputField = document.getElementById(inputFieldId);
              const languageSelector = document.getElementById("language");
              const targetLanguage = languageSelector.value; // Get the selected language
          
              // Initialize SpeechRecognition
              const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
              recognition.lang = 'en-US'; // Set language to English for speech recognition
          
              console.log('Speech Recognition started...');
              
              recognition.start(); // Start speech recognition
          
              recognition.onstart = function () {
                console.log('Speech recognition service has started');
              };
          
              recognition.onresult = async function (event) {
                const spokenText = event.results[0][0].transcript;
                console.log('Recognized text:', spokenText); // Log the recognized text
          
                try {
                  const response = await fetch('/tts/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      text: spokenText, // Send recognized text
                      target: targetLanguage // Send the selected target language
                    })
                  });
          
                  if (!response.ok) {
                    throw new Error('Failed to fetch translated text');
                  }
          
                  const result = await response.json();
                  const translatedText = result.translated; // Get the translated text
                  console.log('Translated text:', translatedText); // Log the translated text
          
                  // Fill the input field with the translated text
                  inputField.value = translatedText;
          
                  console.log(`Text for ${inputFieldId} updated to: ${translatedText}`);
                } catch (error) {
                  console.error('Error in translation:', error);
                  alert('There was an error during translation. Please try again.');
                }
              };
          
              recognition.onerror = function (event) {
                console.error('Error occurred in speech recognition: ', event.error);
                alert('Error in speech recognition, please try again.');
              };
            });
          });
          
          