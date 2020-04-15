/* Prevent frame busting */
console.log('name=', window.name);
console.log('chrome extension=', window.chrome.runtime.id);
if (window.name.indexOf('learnalongo') !== -1) {
  // var el = document.createElement("script");
  // el.textContent = "if (top !== self) {window.self = window.top;}";
  // document.documentElement.appendChild(el);
}

var extensionPath = 'chrome-extension://' + window.chrome.runtime.id + '/index.html#/editor?pdf=';

function interceptClickEvent(e) {
  var href;
  var target = e.target || e.srcElement;
  if (target.tagName === 'A') {
      href = target.getAttribute('href');

      //put your logic here...
      if (href.indexOf('.pdf') !== -1) {
        console.log('pdf clicked');
        //tell the browser not to respond to the link click
        e.preventDefault();
        var bodyTag = document.getElementsByTagName('body')[0];
        bodyTag.innerHTML = '';
        //  LEARNALONGO
        var learnalongoIframe = document.createElement('iframe');
        learnalongoIframe.setAttribute('src', extensionPath + encodeURI(href));
        learnalongoIframe.setAttribute('style', 'width: 100%; height: 100vh;');

        var learnalongoDiv = document.createElement('div');
        learnalongoDiv.setAttribute('style', 'width: 70%;');
        learnalongoDiv.appendChild(learnalongoIframe);

        // PARENT
        var parentIframe = document.createElement('iframe');
        parentIframe.setAttribute('src', window.location.href);
        parentIframe.setAttribute('style', 'width: 100%; height: 100vh;');

        var parentDiv = document.createElement('div');
        parentDiv.setAttribute('style', 'width: 30%;');
        parentDiv.appendChild(parentIframe);

        // CONTAINER
        var containerDiv = document.createElement('div');
        containerDiv.setAttribute('style', 'display: flex;')
        containerDiv.appendChild(learnalongoDiv);
        containerDiv.appendChild(parentDiv);
        bodyTag.appendChild(containerDiv);

      } else {
        console.log('not a pdf');
      }
  }
}


//listen for link click events at the document level
if (document.addEventListener) {
  document.addEventListener('click', interceptClickEvent);
} else if (document.attachEvent) {
  document.attachEvent('onclick', interceptClickEvent);
}
