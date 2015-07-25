$(function() {
  chrome.storage.sync.get('switch', function(val) {
    $('#switch').attr('checked', val['switch'] !== 'false');
  });

  $('#switch').click(function() {
    var sw = this;
    storeState(sw);

    $('.feat').each(function() {
      this.checked = sw.checked;
      storeState(this);
    });
  });

  $('.feat').each(function() {
    var ele = $(this),
        id = this.id;
    ele.click(function() {
      storeState(this);
    });
    chrome.storage.sync.get(this.id, function(val) {
      ele.attr('checked', val[id] !== 'false');
    });
  });

  var storeState = function(feat) {
    chrome.runtime.sendMessage({settingChanged: feat.id + ':' + feat.checked});
  };
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
