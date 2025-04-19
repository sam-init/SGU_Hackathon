
// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', function() {
        navList.classList.toggle('show');
        document.body.classList.toggle('menu-open');
        
        // Toggle hamburger icon animation
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
          this.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 5px)';
          this.querySelector('span:nth-child(2)').style.opacity = '0';
          this.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          this.querySelector('span:nth-child(1)').style.transform = 'none';
          this.querySelector('span:nth-child(2)').style.opacity = '1';
          this.querySelector('span:nth-child(3)').style.transform = 'none';
        }
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navList.classList.contains('show')) {
          navList.classList.remove('show');
          mobileMenuToggle.classList.remove('active');
          mobileMenuToggle.querySelector('span:nth-child(1)').style.transform = 'none';
          mobileMenuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
          mobileMenuToggle.querySelector('span:nth-child(3)').style.transform = 'none';
        }
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70, // Adjust for header height
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Voice Assistant Button
    const voiceButton = document.getElementById('voice-btn');
    
    if (voiceButton) {
      voiceButton.addEventListener('click', function() {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance();
          
          // Text to be spoken in Kannada (placeholder - this is just a representation)
          utterance.text = "ಸಬ್ಕೋಕಾಮ್ ಗ್ರಾಮೀಣ ಭಾಗದಲ್ಲಿ ಕೌಶಲ್ಯವಿಲ್ಲದ ಕಾರ್ಮಿಕರು ಸರಳ, ಪ್ರವೇಶಿಸಬಹುದಾದ ವೇದಿಕೆಯ ಮೂಲಕ ವಿಶ್ವಾಸಾರ್ಹ ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಲು ಮತ್ತು ತಮ್ಮ ಜೀವನೋಪಾಯವನ್ನು ಭದ್ರಪಡಿಸಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.";
          
          // Try to find a Kannada voice
          let kannadaVoice = null;
          const voices = window.speechSynthesis.getVoices();
          
          // Add a small voice check notification
          console.log("Available voices:", voices.map(v => v.name));
          
          // Try to find a Hindi voice as fallback (more commonly available)
          for (let voice of voices) {
            if (voice.lang === 'kn-IN') {
              kannadaVoice = voice;
              break;
            } else if (voice.lang === 'hi-IN') {
              kannadaVoice = voice;
            }
          }
          
          if (kannadaVoice) {
            utterance.voice = kannadaVoice;
          }
          
          utterance.rate = 0.9;
          utterance.pitch = 1;
          
          // Add speaking animation
          voiceButton.classList.add('speaking');
          
          utterance.onend = function() {
            voiceButton.classList.remove('speaking');
          };
          
          window.speechSynthesis.speak(utterance);
        } else {
          alert("Sorry, your browser doesn't support speech synthesis.");
        }
      });
    }
    
    // Animated Number Counter
    function animateCounter(targetNumber, element, duration) {
      let startNumber = 0;
      const increment = targetNumber / (duration / 16);
      const timer = setInterval(() => {
        startNumber += increment;
        if (startNumber >= targetNumber) {
          clearInterval(timer);
          startNumber = targetNumber;
        }
        element.textContent = Math.round(startNumber);
      }, 16);
    }
    
    const numberElements = document.querySelectorAll('.number');
    let countersStarted = false;
    
    // Start counters when they come into view
    function startCountersIfVisible() {
      if (countersStarted) return;
      
      const magicNumbersSection = document.querySelector('.magic-numbers');
      if (!magicNumbersSection) return;
      
      const rect = magicNumbersSection.getBoundingClientRect();
      const isInView = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
      
      if (isInView) {
        numberElements.forEach(element => {
          const targetNumber = parseInt(element.getAttribute('data-target'));
          animateCounter(targetNumber, element, 2000);
        });
        countersStarted = true;
        window.removeEventListener('scroll', startCountersIfVisible);
      }
    }
    
    window.addEventListener('scroll', startCountersIfVisible);
    // Check once on load too
    startCountersIfVisible();
    
    // Horizontal scrolling for gallery with mouse wheel
    const galleryScroller = document.querySelector('.gallery-scroller');
    if (galleryScroller) {
      galleryScroller.addEventListener('wheel', (e) => {
        e.preventDefault();
        galleryScroller.scrollLeft += e.deltaY;
      });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        header.style.padding = '10px 0';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.padding = '15px 0';
      }
    });
    
    // Language Switcher
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
      languageSelect.addEventListener('change', function() {
        // This would be implemented with a proper translation system in a real app
        alert(`Language changed to ${this.options[this.selectedIndex].text}. This feature would be fully implemented in a production environment.`);
      });
    }
  });
  