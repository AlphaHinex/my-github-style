$(document).ready(function () {
  // If user is logged in
  if ($('.logged-in')) {
    console.debug('User logged in.');
    var map = {
      profile: oldMenuBack,
      explore: hideExplore,
      stars: addStars,
      gototop: couldGotoTop,
      market: hideMarket,
      fixheader: fixHeader,
      youknow: addYouKnow
    };

    for (var id in map) {
      makeChange(id, map[id]);
    }
    hideMarket();

    // Bind addYouKnow feature on click of star/unstar button
    $('button[aria-label*=" this repository"]').bind('click', addYouKnow);
  } else {
    console.debug('User did NOT log in!');
  }
});

var makeChange = function(id, callback) {
  chrome.storage.sync.get(id, function(val) {
    if (val && val[id] !== 'undefined' && val[id] !== 'false') {
      callback();
    }
  });
};

var oldMenuBack = function() {
  var avatar = $('#user-links > li:nth-child(3) > details > summary > img');

  // Insert the old link
  var avatar_link = avatar.attr('src');
  var current_username = avatar.attr('alt').replace('@', '');
  var new_link = '';
  new_link += '<li class="header-nav-item dropdown js-menu-container">';
  new_link += '    <a class="js-selected-navigation-item HeaderNavlink px-2" href="/'+current_username+'" data-ga-click="Header, go to profile, text:username">';
  new_link += '      <img alt="@'+current_username+'" class="avatar" height="20" src="'+avatar_link+'" width="20">';
  new_link += '      <span>'+current_username+'</span>';
  new_link += '    </a>';
  new_link += '</li>';
  $('#user-links').prepend(new_link);
};

var headerNav = function() {
    return $('ul[role="navigation"]');
};

var hideExplore = function() {
  $('a[href="/explore"]').hide();
};

var addStars = function() {
  headerNav().append('<li><a href="/stars" class="js-selected-navigation-item HeaderNavlink px-2" data-ga-click="Header, go to starred repos, text:your stars">Stars</a></li>');
};

var goTopEle = function(id) {
    var ele = ''
      + '<span title="Goto top" id="' + id + '" class="goto-top" style="display:none;position:fixed;bottom:100px;cursor:pointer;">'
      + '  <svg height="28" width="28" viewBox="0 0 16 16" class="octicon">'
      + '    <path d="M10 9l-1.5 1.5-3.5-3.75L1.5 10.5 0 9l5-5 5 5z" />'
      + '  </svg>'
      + '</span>';
    return ele;
};

var couldGotoTop = function() {
  $('body').append(goTopEle('top1'));
  $('body').append(goTopEle('top2'));
  adjustGotoTopPos();
  $(window).resize(function() {
    adjustGotoTopPos();
  });
  $(window).scroll(function(){
    $(document).scrollTop() > 10 ? $(".goto-top").fadeIn(500) : $(".goto-top").fadeOut(500);
  });
  $(".goto-top").click(function(e){
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 200);
  });
};

var adjustGotoTopPos = function() {
  var screenWidth = $(window).width();
  var containerWidth = 980 + 20 + 50;
  var margin = screenWidth > containerWidth ? (screenWidth - containerWidth) / 2 : 40;
  $('#top1').css({'left': margin + 'px'});
  $('#top2').css({'right': margin + 'px'});
};

var hideMarket = function() {
  $('a[href="/marketplace"]').hide();
};

var fixHeader = function() {
  if (!$('.logged-in').hasClass('page-profile')) {
    $('.Header').css({'min-width': '100%', 'position': 'fixed', 'z-index': '160'});
    $('div[role="main"]').css({'position': 'relative', 'top': '54px'});
  }  
};

var addYouKnow = function() {
  if ($('.pagehead').hasClass('repohead')) {
    var url = location.href.split('/').slice(0, 5).join('/') + '/stargazers/you_know';
    $.get(url, function(data) {
      // Delete you_know links first
      $('.uno').remove();
      var p = $(data);
      var count = p.find('a[href*="you_know"] .Counter').text();
      var starAEles = $('.pagehead-actions li a.social-count:gt(0):lt(2)');
      // then add new you_know elements
      for (var i = 0; i < starAEles.length; i++) {
        var a = starAEles[i];
        var aCopy = $(a).clone();
        a.title = 'All';
        aCopy.attr('href', url);
        aCopy.attr('title', 'You know');
        aCopy.addClass('uno');
        aCopy.text('');
        aCopy.append(count);
        $(a).after(aCopy);
      }
    });
  }
};