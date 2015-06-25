var settings = {
  get: function(key) {
    return localStorage.getItem(key);
  },

  put: function(key, value) {
    localStorage.setItem(key, value);
  }
};

$(function() {
  $('#explore, #stars, #profile, #network').each(function() {
    var ele = $(this);
    ele.attr('checked', settings.get(this.id) !== 'false');
    ele.click(function() {
      console.log(this.id + ':' + this.checked);
      chrome.runtime.sendMessage({settingChanged: this.id + ':' + this.checked});
    });
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.hasOwnProperty('settingChanged')) {
      var kv = request['settingChanged'].split(':');
      settings.put(kv[0], kv[1]);
    } 
  }
);
