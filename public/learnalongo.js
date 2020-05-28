if (window.chrome && window.chrome.runtime && window.chrome.runtime.onMessage) {
  window.chrome.runtime.onMessage.addListener( function(message, sender, sendResponse) {
    // ADD listeners
    switch(message.type) {
      case "newNote":
        newNote();
        sendResponse('done');
        break;
      case "openNote":
        openNote(message.noteId);
        sendResponse('done');
        break;
      case "openWorkBook":
        openWorkBook(message.workBookId);
        sendResponse('done');
        break;
    }
  });
}

window.learnalongo = true;
console.log('extension=', learnalongo);


if (window.name.indexOf('learnalongo') !== -1) {

  // el.textContent = "if (top !== self) {window.self = window.top;}";
  // document.documentElement.appendChild(el);
}


var basePath = 'https://learnalongo-app.web.app';
var baseImagePath = 'https://learnalongo-app.web.app';
if (window.chrome && window.chrome.runtime.id) {
  basePath = 'chrome-extension://' + window.chrome.runtime.id + "/index.html#";
  baseImagePath = 'chrome-extension://' + window.chrome.runtime.id;
}
var bodyTag = document.getElementsByTagName('body')[0];

/* CREATE DOM ELEMENTS FOR TOOLTIP */
/* Container */
var containerSpan = document.createElement('span');
containerSpan.classList.add('learnalongo-actions')
/* Split button */
var learnalongoSplit = document.createElement('a');
learnalongoSplit.classList.add('learnalongo-split');
learnalongoSplit.style.backgroundImage = "url(" + baseImagePath + "/embed-icons/arrow-split-vertical.svg" + ")";
/* FullScreen button */
var learnalongoFull = document.createElement('a');
learnalongoFull.classList.add('learnalongo-full');
learnalongoFull.style.backgroundImage = "url(" + baseImagePath + "/embed-icons/fullscreen.svg" + ")";
/* Download button */
var learnalongoDownload = document.createElement('a');
learnalongoDownload.classList.add('learnalongo-download');
learnalongoDownload.style.backgroundImage = "url(" + baseImagePath + "/embed-icons/download-outline.svg" + ")";
/* Combine */
containerSpan.appendChild(learnalongoSplit);
containerSpan.appendChild(learnalongoFull);
containerSpan.appendChild(learnalongoDownload);
/* Append */
bodyTag.appendChild(containerSpan);

/* POPPER FUNCTIONS */
let popperInstance = null;

function learnalongoTooltipCreate(learnalongoLinks, learnalongoTooltip) {
  popperInstance = Popper.createPopper(learnalongoLinks, learnalongoTooltip, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 0],
        },
      },
    ],
  });
}

function learnalongoTooltipDestroy() {
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
}

function learnalongoTooltipShow() {
  var learnalongoLinks = document.querySelector('.learnalongo-pdf-link');
  var learnalongoTooltip = document.querySelector('.learnalongo-actions');
  learnalongoTooltip.setAttribute('data-show', '');
  learnalongoTooltipCreate(learnalongoLinks, learnalongoTooltip);
}

function learnalongoTooltipHide() {
  var learnalongoTooltip = document.querySelector('.learnalongo-actions');
  if (learnalongoTooltip) {
    learnalongoTooltip.removeAttribute('data-show');
  }
  learnalongoTooltipDestroy();
}

/* EVENT FUNCTIONS */
function interceptClickEvent(e) {
  var href;
  var target = e.target || e.srcElement;
  if (target.tagName === 'A') {
      href = target.getAttribute('href');
      //put your logic here...
      if (target.classList.contains('learnalongo-split')
      ) {
        e.preventDefault();
        var headingElement = document.querySelector('h1');
        var headingText = headingElement ? headingElement.innerText : '';
        var title = headingText.length > 0 ? headingText : document.title;
        var url = top.location.href;
        splitScreen(basePath + '/workbook?pdf=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title) + '&connectedUrl=' + encodeURIComponent(url));
      } else if (href.indexOf('.pdf') !== -1 && !target.classList.contains('learnalongo-full')) {
        e.preventDefault();
      }
  }
}

function interceptMouseoverEvent(e) {
  var href;
  var download;
  var target = e.target || e.srcElement;
  if (target.tagName === 'A') {
    href = target.getAttribute('href');
    download = target.getAttribute('download') ? target.getAttribute('download') : 'download';
    if (
      (href.indexOf('.pdf') !== -1)
      && !target.parentElement.classList.contains('learnalongo-actions')
      && !target.classList.contains('learnalongo-pdf-link')
      && !target.parentElement.classList.contains('learnalongo-pdf-link')
      && !target.parentElement.parentElement.classList.contains('learnalongo-pdf-link')
    ) {
      var headingElement = document.querySelector('h1');
      var headingText = headingElement ? headingElement.innerText : '';
      var title = headingText.length > 0 ? headingText : document.title;
      var url = top.location.href;
      /* Identify link element */
      target.classList.add('learnalongo-pdf-link');

      learnalongoSplit.setAttribute('href', href);
      learnalongoFull.setAttribute('href',  basePath + '/workbook?pdf=' + encodeURIComponent(href) + '&title=' + encodeURIComponent(title) + '&connectedUrl=' + encodeURIComponent(url));
      learnalongoFull.setAttribute('target', '_blank');
      learnalongoDownload.setAttribute('href', href);
      learnalongoDownload.setAttribute('download', download);

      learnalongoTooltipShow();
    }
  } else if (
    !target.classList.contains('learnalongo-actions')
    && (!target.parentElement || !target.parentElement.classList.contains('learnalongo-actions'))
  ) {
    var link = document.getElementsByClassName('learnalongo-pdf-link');
    if (link && link.length > 0) {
      link[0].classList.remove('learnalongo-pdf-link');
    }
    if (popperInstance) {
      learnalongoTooltipHide();
    }
  }
}

function newNote() {
  var headingElement = document.querySelector('h1');
  var headingText = headingElement ? headingElement.innerText : '';
  var title = headingText.length > 0 ? headingText : document.title;
  var url = top.location.href;
  splitScreen(basePath + '/notebook?title=' + encodeURIComponent(title) + '&connectedUrl=' + encodeURIComponent(url));
}

function openNote(noteId) {
  splitScreen(basePath + '/notebook/' + noteId);
}

function openWorkBook(workBookId) {
  splitScreen(basePath + '/workbook/' + workBookId);
}

function splitScreen(href) {
  var splitFrame = document.querySelector('.learnalongo-iframe');
  if (!splitFrame) {
    bodyTag.innerHTML = '';
    //  LEARNALONGO
    var learnalongoIframe = document.createElement('iframe');
    learnalongoIframe.setAttribute('src', href);
    learnalongoIframe.classList.add('learnalongo-iframe');
    learnalongoIframe.setAttribute('name', 'learnalongoViewer');

    var learnalongoDiv = document.createElement('div');
    learnalongoDiv.classList.add('learnalongo-split-container');
    learnalongoDiv.appendChild(learnalongoIframe);

    // PARENT
    var parentIframe = document.createElement('iframe');
    parentIframe.setAttribute('src', window.location.href);
    parentIframe.classList.add('learnalongo-iframe');
    parentIframe.classList.add('learnalongo-parent-iframe');
    learnalongoIframe.setAttribute('name', 'learnalongoParent');

    var parentDiv = document.createElement('div');
    parentDiv.classList.add('learnalongo-parent-container');
    parentDiv.appendChild(parentIframe);

    // CONTAINER
    var containerDiv = document.createElement('div');
    containerDiv.classList.add('learnalongo-container');
    containerDiv.appendChild(learnalongoDiv);
    containerDiv.appendChild(parentDiv);
    bodyTag.appendChild(containerDiv);
    Split([learnalongoDiv,parentDiv],{
      sizes: [70, 30],
      minSize: 200,
    });
  } else {
    splitFrame.setAttribute('src', href);
  }
}

function removeSplit() {
  var iframeElem = document.querySelector('.learnalongo-parent-iframe');
  if (iframeElem) {
    top.location = iframeElem.contentWindow.location.href;
  }
}

/* ADD EVENT LISTENERS */
//listen for link click events at the document level
if (document.addEventListener) {
  document.addEventListener('click', interceptClickEvent);
} else if (document.attachEvent) {
  document.attachEvent('onclick', interceptClickEvent);
}
// Listen for mouseover
if (document.addEventListener) {
  document.addEventListener('mouseover', interceptMouseoverEvent);
} else if (document.attachEvent) {
  document.attachEvent('mouseover', interceptMouseoverEvent);
}

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Listen to message from child window
eventer(messageEvent,function(e) {
    var key = e.message ? "message" : "data";
    var data = e[key];
    //run function//
    switch (data) {
      case 'removeSplit':
        removeSplit();
        break;
    }
},false);