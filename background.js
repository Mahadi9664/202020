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
    // Send message to all tabs to show notification
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { action: 'showBreakReminder' }).catch(() => {
          // Ignore errors for tabs that can't receive messages
        });
      });
    });
  }
});