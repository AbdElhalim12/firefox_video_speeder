let currentSpeed = 1.0;
const SPEED_STEP = 0.1;

// Default shortcuts
let shortcuts = {
  decreaseSpeed: 'Ctrl+ArrowDown',
  increaseSpeed: 'Ctrl+ArrowUp',
  resetSpeed: 'Ctrl+R'
};

// Load saved shortcuts on startup
chrome.storage.sync.get(['shortcuts'], function(result) {
  if (result.shortcuts) {
    shortcuts = result.shortcuts;
  }
});

// Comprehensive message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'updateShortcuts':
      shortcuts = request.shortcuts;
      break;

    case "decreaseSpeed":
      currentSpeed = Math.max(0.1, currentSpeed - SPEED_STEP);
      updateTabSpeed(currentSpeed);
      break;

    case "increaseSpeed":
      currentSpeed = Math.min(4.0, currentSpeed + SPEED_STEP);
      updateTabSpeed(currentSpeed);
      break;

    case "resetSpeed":
      currentSpeed = 1.0;
      updateTabSpeed(currentSpeed);
      break;

    case "broadcastSpeed":
      currentSpeed = request.speed;
      break;

    case "getCurrentSpeed":
      sendResponse({speed: currentSpeed});
      return true;  // Needed for async sendResponse
  }
});

function updateTabSpeed(speed) {
  // Update all active tabs
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: "setSpeed",
        speed: speed
      });
    });

    // Notify popups to update their display
    chrome.runtime.sendMessage({
      action: "updatePopupSpeed",
      speed: speed
    });
  });
}