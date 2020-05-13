/* Prevent frame busting */
console.log('name=', window.name);
console.log('chrome extension=', window.chrome.runtime.id);
if (window.name.indexOf('learnalongo') !== -1) {

  // el.textContent = "if (top !== self) {window.self = window.top;}";
  // document.documentElement.appendChild(el);
}

// var el = document.createElement("script");
// el.setAttribute('src', 'https://unpkg.com/@popperjs/core@2');
// document.documentElement.appendChild(el);

var extensionPath = 'chrome-extension://' + window.chrome.runtime.id + '/index.html#/editor?pdf=';
var bodyTag = document.getElementsByTagName('body')[0];

/* CREATE DOM ELEMENTS FOR TOOLTIP */
/* Container */
var containerSpan = document.createElement('span');
containerSpan.classList.add('learnalongo-actions')
/* Split button */
var learnalongoSplit = document.createElement('a');
learnalongoSplit.classList.add('learnalongo-split');
/* FullScreen button */
var learnalongoFull = document.createElement('a');
learnalongoFull.classList.add('learnalongo-full');
/* Download button */
var learnalongoDownload = document.createElement('a');
learnalongoDownload.classList.add('learnalongo-download');
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
  console.log('learnalongoTooltip=', learnalongoTooltip);
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
      console.log('target classList=', target.classList);
      //put your logic here...
      if (target.classList.contains('learnalongo-split')
      ) {
        e.preventDefault();
        splitScreen(extensionPath + encodeURI(href));
      } else if (href.indexOf('.pdf') !== -1) {
        e.preventDefault();
      } else {
        console.log('not a pdf');
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
      console.log('elodie we made it past the test')
      /* Identify link element */
      target.classList.add('learnalongo-pdf-link');

      learnalongoSplit.setAttribute('href', href);
      learnalongoFull.setAttribute('href', extensionPath + encodeURI(href));
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
      console.log('need to hide tooltip');
      learnalongoTooltipHide();
    }
  }
}

function splitScreen(href) {
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
  })
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