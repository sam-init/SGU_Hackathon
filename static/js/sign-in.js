


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
