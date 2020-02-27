console.log('popup');
var popupURL = chrome.runtime.getURL("index.html");
var windowWidth = Math.floor(window.screen.availWidth);
var windowHeight = Math.floor(window.screen.availHeight);
console.log('availWidth=', windowWidth);
var popupWidth = 500;
chrome.windows.getCurrent({populate: false}, function (currentWindow) {
  /* get the current window so we can set it back on leave */
  window.chrome.extension.sendMessage({ type: 'setLastFocusedWindowId', lastFocusedId:  currentWindow.id}, function(res) {
    console.log('currentWindow.id=', currentWindow.id);
    /* set the current window size */
    chrome.windows.update(currentWindow.id, { width: (windowWidth - popupWidth), top: 0, left: 0 });
    if (!res.popupWindowId) {
      /* Not open so open */
      chrome.windows.create({
        url: popupURL,
        type: "normal",
        height: windowHeight,
        width: popupWidth,
        top: 0,
        left: (windowWidth - popupWidth),
      });
    } else {
      /* Already open so just focus */
      chrome.windows.update(res.popupWindowId, {focused: true,});
    }
    window.close();
  });

  /* chrome.windows.getCurrent(
    {populate: false},
    function(currentWindow) {
        chrome.windows.update(currentWindow.id, { width: (windowWidth - popupWidth) });
    }
  );
  window.close(); */
})


