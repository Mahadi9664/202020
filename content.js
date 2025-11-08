// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showBreakReminder') {
    showBreakNotification();
    sendResponse({status: 'shown'});
  }
  return true; // Keep message channel open for async response
});

function playBeep() {
  // Use a try...catch in case AudioContext is not supported (e.g., in some test envs)
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    console.error('AudioContext error:', e);
  }
  
}

function showBreakNotification() {
  console.log('showBreakNotification called!');
  
  // Play three beeps
  playBeep();
  setTimeout(playBeep, 400);
  setTimeout(playBeep, 800);
  
  // Make sure body exists
  if (!document.body) {
    console.error('document.body not available!');
    return;
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'break-reminder-202020';
  notification.innerHTML = `
    <div class="break-content">
      <div class="break-icon">👁️</div>
      <div class="break-text">
        <strong>20-20-20 Break Time!</strong>
        <p>Look at something 20 feet away for 20 seconds</p>
      </div>
      <button class="break-dismiss">✕</button>
    </div>
  `;
  
  try {
    document.body.appendChild(notification);
    console.log('Notification element created and appended!');
  } catch (e) {
    console.error('Error appending notification:', e);
    return;
  }
  
  // <-- FIX: The code from this point on was outside the function.
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Dismiss button
  const dismissBtn = notification.querySelector('.break-dismiss');
  if (dismissBtn) { // Add a null check for safety
    dismissBtn.addEventListener('click', () => {
      notification.classList.remove('show');
      // Wait for animation to finish before removing
      setTimeout(() => notification.remove(), 300); 
    });
  }
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    // Check if the element still exists (user might have clicked dismiss)
    if (notification && notification.parentNode) { 
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }, 10000);
} // <-- FIX: This is the correct closing brace for the function

// Test function - expose globally for testing
window.testBreakReminder = function() {
  showBreakNotification();
};

console.log('202020 content script loaded!');