var learnalongoUrl = "https://learnalongo-app.web.app";

var url = learnalongoUrl + "/learnalongo.js";
var script1=document.createElement('script');
script1.src=url;
document.querySelector("body").appendChild(script1);

url = learnalongoUrl + "/popper.js";
var script2=document.createElement('script');
script2.src=url;
document.querySelector("body").appendChild(script2);

url = learnalongoUrl + "/split.js";
var script3=document.createElement('script');
script3.src=url;
document.querySelector("body").appendChild(script3);

url = learnalongoUrl + "/learnalongo.css";
var css=document.createElement('link');
css.setAttribute("href", url);
css.setAttribute("rel", "stylesheet");
document.head.appendChild(css);
