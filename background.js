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

console.log('Background script loaded!');
let detectionCount = 0;

// Create AudioContext for beep sound
async function playBeep() {
  console.log('Attempting to play beep...');
  try {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz - A4 note

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    console.log('Beep played successfully!');
  } catch (error) {
    console.error('Error playing beep:', error);
  }
}

// Check if URL contains any AI-related keywords
function containsAIKeyword(url) {
  const urlLower = url.toLowerCase();
  return AI_KEYWORDS.some(keyword => urlLower.includes(keyword.toLowerCase()));
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('Tab updated:', {
    tabId: tabId,
    changeInfo: changeInfo,
    url: tab?.url
  });

  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Checking URL:', tab.url);
    
    if (containsAIKeyword(tab.url)) {
      console.log('AI website detected:', tab.url);
      detectionCount++;
      
      playBeep();
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'AI Website Detected',
        message: `Access detected to: ${tab.url}`
      }, (notificationId) => {
        console.log('Notification created:', notificationId);
      });

      chrome.storage.local.set({
        lastDetection: {
          url: tab.url,
          timestamp: new Date().toISOString(),
          count: detectionCount
        }
      }, () => {
        console.log('Detection saved to storage');
      });
    }
  }
});