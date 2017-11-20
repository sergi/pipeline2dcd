require('webext-inject-on-install');

let SESSION;

function getActiveTab() {
  return browser.tabs.query({ active: true, currentWindow: true });
}

function sessionUpdate(session) {
  getActiveTab().then(tabs => {
    // console.log("SESSION=" + session);
    browser.tabs.sendMessage(tabs[0].id, { session });
  });
}

function listener(details) {
  if (SESSION) {
    return {};
  }

  const headers = details.requestHeaders;
  for (header of headers) {
    if (
      header.name.toLowerCase() === "cookie" &&
      header.value.indexOf("SESSION") !== -1
    ) {
      SESSION = header.value.split("=")[1];
      sessionUpdate(SESSION);
      return {};
    }
  }

  return {};
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  listener,
  // filters
  {
    urls: ["https://*.schibsted.io/*"]
  },
  // extraInfoSpec
  ["blocking", "requestHeaders"]
);
