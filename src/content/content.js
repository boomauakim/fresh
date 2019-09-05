chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.event === 'REFRESH') {
    const searchTerm = new RegExp(message.expected, 'g');
    const found = searchTerm.test(document.all[0].outerHTML);

    const resp = {
      found,
      endpoint: message.endpoint,
      expected: message.expected,
      timeout: message.timeout
    };

    sendResponse(resp);
  }
});
