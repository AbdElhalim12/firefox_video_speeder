(function() {
    // Default shortcuts
    let shortcuts = {
      decreaseSpeed: 'Ctrl+ArrowDown',
      increaseSpeed: 'Ctrl+ArrowUp',
      resetSpeed: 'Ctrl+R'
    };
  
    // Function to modify video speed
    function setVideoSpeed(speed) {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        video.playbackRate = speed;
      });
    }
  
    // Load saved shortcuts
    chrome.storage.sync.get(['shortcuts'], function(result) {
      if (result.shortcuts) {
        shortcuts = result.shortcuts;
      }
    });
  
    // Listen for speed and shortcut messages
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch(request.action) {
        case "setSpeed":
          setVideoSpeed(request.speed);
          break;
        case 'updateShortcuts':
          shortcuts = request.shortcuts;
          break;
      }
    });
  
    // Global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // Parse shortcut combinations
      function matchShortcut(savedShortcut, event) {
        const keys = savedShortcut.split('+');
        const ctrlPressed = event.ctrlKey || event.metaKey;
        const altPressed = event.altKey;
        const shiftPressed = event.shiftKey;
  
        // Check for each key in the combination
        return keys.every(key => {
          switch(key.toLowerCase()) {
            case 'ctrl':
              return ctrlPressed;
            case 'alt':
              return altPressed;
            case 'shift':
              return shiftPressed;
            case 'cmd':
              return event.metaKey;
            default:
              return event.key.toLowerCase() === key.toLowerCase();
          }
        });
      }
  
      // Check each shortcut
      if (matchShortcut(shortcuts.decreaseSpeed, event)) {
        chrome.runtime.sendMessage({action: "decreaseSpeed"});
        event.preventDefault();
      }
      else if (matchShortcut(shortcuts.increaseSpeed, event)) {
        chrome.runtime.sendMessage({action: "increaseSpeed"});
        event.preventDefault();
      }
      else if (matchShortcut(shortcuts.resetSpeed, event)) {
        chrome.runtime.sendMessage({action: "resetSpeed"});
        event.preventDefault();
      }
    });
  })();