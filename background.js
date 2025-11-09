// Create alarm when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('screenBreak', {
    periodInMinutes: 20
  });
  console.log('202020 extension installed - 20 minute timer started');
});

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'screenBreak') {
    // Send message only to the active tab in the current window
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'showBreakReminder' })
          .then(() => {
            console.log(`Reminder sent to active tab ${tabs[0].id}`);
          })
          .catch((error) => {
            console.log(`Could not send to active tab:`, error.message);
          });
      }
    });
  }
});