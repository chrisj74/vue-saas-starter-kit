var HEADERS_TO_STRIP_LOWERCASE = ["content-security-policy", "x-frame-options", "access-control-allow-origin", "x-content-type-options"];

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    /* return {
      responseHeaders: details.responseHeaders.filter(function(header) {
        return (
          HEADERS_TO_STRIP_LOWERCASE.indexOf(header.name.toLowerCase()) < 0
        );
      })
    }; */

    /* var headers = details.responseHeaders.filter(function(header) {
      return (
        HEADERS_TO_STRIP_LOWERCASE.indexOf(header.name.toLowerCase()) < 0
      );
    });
    headers.push({
      name: "Access-Control-Allow-Origin",
      value: "*"
    });

    return {
      responseHeaders: headers
    }; */
  },
  {
    urls: ["<all_urls>"]
  },
  ["blocking", "responseHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (
      details.initiator.indexOf(chrome.runtime.id) != -1
      && (details.url.indexOf("cdn.tiny.cloud") !== -1)
    ) {
      var newRef = "https://workalongo.web.app";
      var gotRef = false;
      for(var n in details.requestHeaders){
        gotRef = details.requestHeaders[n].name.toLowerCase()=="referer";
        if(gotRef){
          details.requestHeaders[n].value = newRef;
          break;
        }
      }
      if(!gotRef){
        details.requestHeaders.push({name:"Referer",value:newRef});
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders", "extraHeaders"]
);

/* MESSAGES */
chrome.extension.onMessageExternal.addListener(function(message, sender, sendResponse) {
  if (message.type == "ping") {
    sendResponse({
      type: 'pong',
    });
  }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  // ADD Listeners
});

// When a window is closed
chrome.windows.onRemoved.addListener(function(windowId) {
  // Add listeners
});

/* When window added */
chrome.windows.onRemoved.addListener(function() {
  // Add listeners
});

/* Add tab */
chrome.tabs.onCreated.addListener(function() {
  // Add listeners
});

/* Update tab */
chrome.tabs.onUpdated.addListener(function() {
  // Add listeners
});

/* Add tab */
chrome.tabs.onRemoved.addListener(function() {
  // Add listeners
});
