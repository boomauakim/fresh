let status = 'stop';

function initial() {
  chrome.storage.sync.get(
    ['endpoint', 'expected', 'timeout', 'status'],
    items => {
      document.getElementById('endpoint').value = items.endpoint
        ? items.endpoint
        : '';
      document.getElementById('expected').value = items.expected
        ? items.expected
        : '';
      document.getElementById('timeout').value = items.timeout
        ? items.timeout
        : '';

      if (items.status === 'stop' || items.status === undefined) {
        status = 'stop';
        document.getElementById('button').style['background-color'] = '#6dc5ed';
        document.getElementById('button').innerHTML = 'Start';
      } else {
        status = 'start';
        document.getElementById('button').style['background-color'] = '#eb5850';
        document.getElementById('button').innerHTML = 'Stop';
      }
    }
  );
}

function validate() {
  let pass = true;

  const endpoint = document.getElementById('endpoint').value;
  const expected = document.getElementById('expected').value;
  const timeout = document.getElementById('timeout').value;

  if (!endpoint) {
    document.getElementById('endpoint').style['background-color'] = '#ffebee';
    pass = false;
  } else {
    document.getElementById('endpoint').style['background-color'] = '#f1f3f4';
  }

  if (!expected) {
    document.getElementById('expected').style['background-color'] = '#ffebee';
    pass = false;
  } else {
    document.getElementById('expected').style['background-color'] = '#f1f3f4';
  }

  if (!timeout) {
    document.getElementById('timeout').style['background-color'] = '#ffebee';
    pass = false;
  } else {
    document.getElementById('timeout').style['background-color'] = '#f1f3f4';
  }

  return pass;
}

function run() {
  const endpoint = document.getElementById('endpoint').value;
  const expected = document.getElementById('expected').value;
  const timeout = document.getElementById('timeout').value;

  if (validate()) {
    if (status === 'stop') {
      status = 'start';
      document.getElementById('button').style['background-color'] = '#eb5850';
      document.getElementById('button').innerHTML = 'Stop';
    } else {
      status = 'stop';
      document.getElementById('button').style['background-color'] = '#6dc5ed';
      document.getElementById('button').innerHTML = 'Start';
    }

    chrome.storage.sync.set({
      endpoint,
      expected,
      timeout,
      status
    });

    const data = {
      endpoint,
      expected,
      timeout
    };

    const bgPage = chrome.extension.getBackgroundPage();
    bgPage.refreshPage(status, data);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('button').addEventListener('click', run);
});

chrome.runtime.onMessage.addListener(message => {
  if (message.event === 'FOUND') {
    status = 'stop';

    document.getElementById('button').style['background-color'] = '#6dc5ed';
    document.getElementById('button').innerHTML = 'Start';

    chrome.storage.sync.set({
      status
    });
  }
});

initial();
