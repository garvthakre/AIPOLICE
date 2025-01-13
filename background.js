chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const aiSites = ["openai.com", "gemini.com", "bard.google.com"];
  
  if (changeInfo.url) {
    const isAISite = aiSites.some((site) => changeInfo.url.includes(site));
    if (isAISite) {
      // Beep sound
      const audio = new Audio(chrome.runtime.getURL("beep.mp3"));
      audio.play();

      // Notify lab instructor
      fetch("https://example.com/lab-instructor-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "AI website accessed",
          url: changeInfo.url
        })
      });
    }
  }
});
