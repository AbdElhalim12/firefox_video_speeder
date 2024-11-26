document.addEventListener('DOMContentLoaded', function() {
    const decreaseBtn = document.getElementById('decreaseSpeed');
    const increaseBtn = document.getElementById('increaseSpeed');
    const resetBtn = document.getElementById('resetSpeed');
    const speedDisplay = document.getElementById('speedDisplay');
  
    // Shortcut input elements
    const decreaseSpeedShortcut = document.getElementById('decreaseSpeedShortcut');
    const increaseSpeedShortcut = document.getElementById('increaseSpeedShortcut');
    const resetSpeedShortcut = document.getElementById('resetSpeedShortcut');
    const saveShortcutsBtn = document.getElementById('saveShortcuts');
  
    const SPEED_STEP = 0.1;
    let currentSpeed = 1.0;
  
    // Default shortcuts
    const defaultShortcuts = {
      decreaseSpeed: 'Ctrl+ArrowDown',
      increaseSpeed: 'Ctrl+ArrowUp',
      resetSpeed: 'Ctrl+R'
    };
  
    // Function to update speed display and sync across tabs
    function updateSpeed(newSpeed) {
      currentSpeed = Math.max(0.1, Math.min(4.0, newSpeed));
      speedDisplay.value = `${currentSpeed.toFixed(1)}x`;
      
      // Sync speed across all tabs
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "setSpeed",
          speed: currentSpeed
        });
  
        // Broadcast speed to all tabs
        chrome.runtime.sendMessage({
          action: "broadcastSpeed",
          speed: currentSpeed
        });
      });
    }
  
    // Listen for speed updates from other sources
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "updatePopupSpeed") {
        speedDisplay.value = `${request.speed.toFixed(1)}x`;
        currentSpeed = request.speed;
      }
    });
  
    decreaseBtn.addEventListener('click', () => {
      updateSpeed(currentSpeed - SPEED_STEP);
    });
  
    increaseBtn.addEventListener('click', () => {
      updateSpeed(currentSpeed + SPEED_STEP);
    });
  
    resetBtn.addEventListener('click', () => {
      updateSpeed(1.0);
    });
  
    // Rest of the previous popup.js code remains the same...
    // (shortcut setup, save shortcuts, etc.)
  
    // On popup open, get current speed from background script
    chrome.runtime.sendMessage({action: "getCurrentSpeed"}, function(response) {
      if (response && response.speed) {
        speedDisplay.value = `${response.speed.toFixed(1)}x`;
        currentSpeed = response.speed;
      }
    });
  });