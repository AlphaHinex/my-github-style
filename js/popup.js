$(function() {
  $('#explore, #stars, #profile, #gototop, #network').each(function() {
    var ele = $(this),
        id = this.id;
    ele.click(function() {
      chrome.runtime.sendMessage({settingChanged: this.id + ':' + this.checked});
    });
    chrome.storage.sync.get(this.id, function(val) {
      ele.attr('checked', val[id] !== 'false');
    });
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.hasOwnProperty('settingChanged')) {
      var kv = request['settingChanged'].split(':'),
          kvObj = {};
      kvObj[kv[0]] = kv[1];
      chrome.storage.sync.set(kvObj);
    } 
  }
);
