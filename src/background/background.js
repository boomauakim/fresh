let refreshStatus = '';

function responseFromSender(resp) {
  if (refreshStatus === 'start') {
    const timeout = resp.timeout ? resp.timeout : 5000;

    if (resp.found !== true || resp.found === undefined) {
      setTimeout(() => {
        // eslint-disable-next-line no-use-before-define
        refreshPage(refreshStatus, resp);
      }, timeout);
    } else {
      chrome.runtime.sendMessage({
        event: 'FOUND'
      });
    }
  }
}

async function refreshPage(status = refreshStatus, data) {
  refreshStatus = status;

  if (refreshStatus === 'start') {
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 1;
    const oneDayAgo = new Date().getTime() - millisecondsPerWeek;
    await chrome.browsingData.remove(
      {
        since: oneDayAgo
      },
      {
        appcache: true,
        cache: true,
        cacheStorage: true,
        cookies: true,
        downloads: true,
        fileSystems: true,
        formData: true,
        history: true,
        indexedDB: true,
        localStorage: true,
        pluginData: true,
        passwords: true,
        serviceWorkers: true,
        webSQL: true
      }
    );

    await chrome.tabs.update({
      url: data.endpoint
    });

    await setTimeout(() => {
      const params = {
        active: true,
        currentWindow: true
      };

      const message = {
        event: 'REFRESH',
        endpoint: data.endpoint,
        expected: data.expected,
        timeout: data.timeout
      };

      const gotTabs = tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message, responseFromSender);
      };

      chrome.tabs.query(params, gotTabs);
    }, 2000);
  }
}
