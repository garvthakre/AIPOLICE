document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup loaded!');
    
    const keywordList = document.getElementById('keywordList');
    const lastDetectionElement = document.getElementById('lastDetection');
    const detectionCountElement = document.getElementById('detectionCount');
    
    const AI_KEYWORDS = [
      "openai",
      "chatgpt",
      "gpt",
      "gemini",
      "claude",
      "bard",
      "anthropic",
      "chat-gpt",
      "bing.com/chat"
    ];
    
    // Display monitored keywords
    AI_KEYWORDS.forEach(keyword => {
      const span = document.createElement('span');
      span.className = 'keyword';
      span.textContent = keyword;
      keywordList.appendChild(span);
    });
  
    // Load and display last detection
    chrome.storage.local.get(['lastDetection'], function(result) {
      console.log('Retrieved from storage:', result);
      if (result.lastDetection) {
        lastDetectionElement.textContent = `${result.lastDetection.url} at ${new Date(result.lastDetection.timestamp).toLocaleString()}`;
        detectionCountElement.textContent = result.lastDetection.count;
      }
    });
  
    // Add test beep button functionality
    document.getElementById('testBeep').addEventListener('click', async function() {
      console.log('Test beep button clicked');
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
  
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
  
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    });
  });