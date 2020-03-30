var HEADERS_TO_STRIP_LOWERCASE = ["content-security-policy", "x-frame-options", "access-control-allow-origin", "x-content-type-options"];

var sidebarTabId = null;
var sidebarWindowId = null;
var lastFocusedWindowId = null;
var lastFocusedTabId = null;
var lastFocusedTabUrl = null;
var lastFocusedTabFavicon = null;
var lastFocusedTabLabel = null;
var popupWindowId = null;
var popupTabId = null;
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
    if (
      sidebarTabId &&
      details.tabId === sidebarTabId &&
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

/* Initial */

window.chrome.windows.getLastFocused((lastWindow) => {
  lastFocusedWindowId = lastWindow.id;
});

/* MESSAGES */
chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type == "setSidebarTabId") {
    /* Set tabId of sidebar so we only change headers on iframes in our app */
    sidebarTabId = sender.tab.id;
    sendResponse({ tabId: sender.tab.id });
    sidebarWindowId = sender.tab.windowId;
    chrome.runtime.sendMessage({
      type: 'setSidebar',
      sidebarWindowId: sidebarWindowId,
      sidebarTabId: sidebarTabId,
    });
  } else if (message.type == "getSidebar") {
    /* Get sidebar window and tab */
    chrome.runtime.sendMessage({
      type: 'setSidebar',
      sidebarWindowId: sidebarWindowId,
      sidebarTabId: sidebarTabId,
    });
  } else if (message.type == "getMyWindow") {
    /* return sender details */
    if (message.setLastFocused) {
      lastFocusedWindowId = sender.tab.windowId;
      chrome.runtime.sendMessage({
        type: 'setLastFocusedWindow',
        windowId: lastFocusedWindowId,
      })
    }
    sendResponse({
      tabId: sender.tab.id,
      windowId: sender.tab.windowId
    });
  } else if (message.type == "sidebarMouseEnter") {
    /* focus the sidebar */
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
        chrome.runtime.sendMessage({
          type: 'setLastFocusedWindow',
          windowId: lastFocusedWindowId,
        })
      }
    })
  } else if (message.type == 'sidebarMouseLeave' && lastFocusedWindowId) {
    /* re-focus on the last focused window */
    chrome.windows.update(lastFocusedWindowId, { focused: true });
  } else if (message.type == "setLastFocusedWindowId") {
    /* set last focused window id & send sidebar window id */
    lastFocusedWindowId = message.lastFocusedId;
    sendResponse({
      sidebarWindowId: sidebarWindowId,
      sidebarTabId: sidebarTabId
    });
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
  } else if (message.type == "getAllWindows") {
    sendAllWindows();
  } else if (message.type == "setPopup") {
    popupWindowId = message.sender.windowId;
  }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  if (!noFocus && windowId == -1) {
    /* All windows have lost focus */
    noFocus = true;
  } else if (noFocus && sidebarWindowId && windowId != sidebarWindowId) {
    /* bring sidebar to front */
    noFocus = false;
    lastFocusedWindowId = windowId;
    chrome.windows.update(sidebarWindowId, { focused: true }, function(win) {
      chrome.windows.update(lastFocusedWindowId, { focused: true })
    });
  }
});

// When a window is closed
chrome.windows.onRemoved.addListener(function(windowId) {
  // If the window getting closed is the sidebar we created
  if (windowId === sidebarWindowId) {
    // Set sidebarId to undefined so we know the sidebar is not open
    sidebarTabId = null;
    sidebarWindowId = null;
    chrome.runtime.sendMessage({
      type: 'setSidebar',
      sidebarWindowId: sidebarWindowId,
      sidebarTabId: sidebarTabId,
    });
    sendAllWindows();
  } else {
    sendAllWindows();
  }
});

/* When window added */
chrome.windows.onRemoved.addListener(function() {
  sendAllWindows();
});

/* Add tab */
chrome.tabs.onCreated.addListener(function() {
  sendAllWindows();
});

/* Update tab */
chrome.tabs.onUpdated.addListener(function() {
  sendAllWindows();
});

/* Add tab */
chrome.tabs.onRemoved.addListener(function() {
  sendAllWindows();
});

var sendAllWindows = function() {
  chrome.windows.getAll({"populate" : true}, function(allWindows) {
    chrome.runtime.sendMessage({
      type: 'setAllWindows',
      allWindows: allWindows,
    });
  });
};
