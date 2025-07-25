"use strict";
// Only run in chat iframe
if (window.location.href.includes('live_chat')) {
    console.log('Enhanced YouTube Chat loaded in iframe');
    // Add persistent CSS for large emojis and text messages
    const style = document.createElement('style');
    style.textContent = `
    .large-emoji img {
      width: 36px !important;
      height: 36px !important;
      margin: 0 4px !important;
    }
    .large-text {
      font-size: 15px !important;
    }
  `;
    document.head.appendChild(style);
    // Listen for new messages using MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof Element && node.matches('yt-live-chat-text-message-renderer')) {
                        // Get message content and check if it's emoji-only
                        const messageEl = node.querySelector('#message');
                        let hasText = false;
                        let hasEmojis = false;
                        if (messageEl) {
                            messageEl.childNodes.forEach(child => {
                                if (child.nodeType === Node.TEXT_NODE) {
                                    hasText = true;
                                }
                                else if (child instanceof Element && child.tagName === 'IMG') {
                                    hasEmojis = true;
                                }
                            });
                            // If message has only emojis (no text), make them larger
                            if (hasEmojis && !hasText) {
                                // Add CSS class instead of inline styles
                                messageEl.classList.add('large-emoji');
                            }
                            else if (hasText) {
                                // Message has text, slightly enlarge it
                                messageEl.classList.add('large-text');
                            }
                        }
                    }
                });
            }
        });
    });
    // Start observing when chat container is available
    setTimeout(() => {
        const chatContainer = document.querySelector('#items');
        if (chatContainer) {
            observer.observe(chatContainer, { childList: true, subtree: true });
            console.log('Now monitoring chat messages');
        }
    }, 1000);
}
