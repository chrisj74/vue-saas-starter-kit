var HEADERS_TO_STRIP_LOWERCASE = ["content-security-policy", "x-frame-options", "access-control-allow-origin", "x-content-type-options"];

var popupTabId = null;
var popupWindowId = null;
var lastFocusedWindowId = null;
var lastFocusedTabId = null;
var lastFocusedTabUrl = null;
var lastFocusedTabFavicon = null;
var lastFocusedTabLabel = null;
var noFocus = false;

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
    // console.log('parent frame=', details.parentFrameId);
    // console.log('frameId=', details.frameId);
    // console.log('request urls=', details.url);
    // console.log('tabId=', details.tabId);
    // console.log('popupTabId=', popupTabId);
    if (
      popupTabId &&
      details.tabId === popupTabId &&
      details.frameId !== -1 &&
      (details.url.indexOf("www.google.") !== -1 || details.url.indexOf('https://github.com/') !== -1)
    ) {
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === "User-Agent") {
          details.requestHeaders[i].value =
            "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1";
          break;
        }
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

/* MESSAGES */
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type == "getTabId") {
    /* Get tabId of popup so we only change headers on iframes in our app */
    popupTabId = sender.tab.id;
    sendResponse({ tabId: sender.tab.id });
    popupWindowId = sender.tab.windowId;
  } else if (message.type == "popupMouseEnter") {
    /* focus the popup */
    chrome.windows.getCurrent({populate: true}, function (win) {
      /* get the current window so we can set it back on leave */
      if (win.id !== sender.tab.windowId) {
        if (win.tabs && win.tabs.length > 0) {
          win.tabs.forEach((tab) => {
            if (tab.highlighted) {
              lastFocusedTabId = tab.id;
              lastFocusedTabUrl = tab.url;
              lastFocusedTabFavicon = tab.favIconUrl;
              lastFocusedTabLabel = tab.title;
            }
          })
        } else {
          lastFocusedTabId = null;
          lastFocusedTabUrl = null;
          lastFocusedTabFavicon = null;
          lastFocusedTabLabel = null;
        }
        chrome.windows.update(sender.tab.windowId, { focused: true });
        lastFocusedWindowId = win.id;
      }
    })
  } else if (message.type == 'popupMouseLeave' && lastFocusedWindowId) {
    /* re-focus on the last focused window */
    chrome.windows.update(lastFocusedWindowId, { focused: true });
  } else if (message.type == "setLastFocusedWindowId") {
    /* set last focused window id & send popup window id */
    lastFocusedWindowId = message.lastFocusedId;
    sendResponse({ popupWindowId: popupWindowId });
  } else if (message.type == "setLastFocusedId") {
    /* Set the last focused id */
    lastFocusedWindowId = message.lastFocusedId;
  } else if (message.type == "getLastFocused") {
    /* Get getLastFocusedTabUrl */
    sendResponse({
      lastFocusedTabUrl: lastFocusedTabUrl,
      lastFocusedTabFavicon: lastFocusedTabFavicon,
      lastFocusedTabLabel: lastFocusedTabLabel,
      lastFocusedWindowId: lastFocusedWindowId
    });
  }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  if (!noFocus && windowId == -1) {
    /* All windows have lost focus */
    noFocus = true;
  } else if (noFocus && popupWindowId && windowId != popupWindowId) {
    /* bring popup to front */
    noFocus = false;
    lastFocusedWindowId = windowId;
    chrome.windows.update(popupWindowId, { focused: true }, function(win) {
      chrome.windows.update(lastFocusedWindowId, { focused: true })
    });
  }
});

// When a window is closed
chrome.windows.onRemoved.addListener(function(windowId) {
  // If the window getting closed is the popup we created
  if (windowId === popupWindowId) {
    // Set popupId to undefined so we know the popups not open
    popupId = null;
    popupWindowId = null;
  }
});
