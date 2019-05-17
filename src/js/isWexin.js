function is_weixin() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}
var isWeixin = is_weixin();
var winHeight =
  typeof window.innerHeight != 'undefined'
    ? window.innerHeight
    : document.documentElement.clientHeight;
function loadHtml() {
  var div = document.createElement('div');
  div.id = 'weixin-tip';
  div.innerHTML =
    '<p style="text-align: center;"><img style="width: 100%" src="../images/open_with_wechat.png" alt="微信打开" /></p>';
  console.log(document.body);
  document.body.appendChild(div);
}
function loadStyleText(cssText) {
  var style = document.createElement('style');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  try {
    style.appendChild(document.createTextNode(cssText));
  } catch (e) {
    style.styleSheet.cssText = cssText; //ie9以下
  }
  var head = document.getElementsByTagName('head')[0]; //head标签之间加上style样式
  head.appendChild(style);
}
var cssText =
  '#weixin-tip{position: fixed; left:0; top:0; background: #fff; filter:alpha(opacity=80); width: 100%; height:100%; z-index: 100;} #weixin-tip p{text - align: center; margin-top: 10%; padding:0 5%;}';
if (!isWeixin) {
  loadHtml();
  loadStyleText(cssText);
}
