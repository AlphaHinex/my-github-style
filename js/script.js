$(document).ready(function () {
  // If user is logged in
  if ($('.header').hasClass('header-logged-in')) {
    var map = {
      profile: oldMenuBack,
      explore: addExplore,
      stars: addStars,
      gototop: couldGotoTop,
      network: addNetworkLink,
      gist: hideGist,
      fixheader: fixHeader,
      youknow: addYouKnow
    };

    for (var id in map) {
      makeChange(id, map[id]);
    }
  };
});

var makeChange = function(id, callback) {
  chrome.storage.sync.get(id, function(val) {
    if (val && val[id] !== 'false') {
      callback();
    }
  });
};

var oldMenuBack = function() {
  var avatar = $('#user-links li').last().find('img');

  // 1. Replace the origin avatar
  avatar.replaceWith('<span class="octicon octicon-octoface avatar" style="margin-top: 3px;"></span>');

  // 2. Insert the old link
  var avatar_link = avatar.attr('src');
  var current_username = avatar.attr('alt').replace('@', '');
  var new_link = '';
  new_link += '<li class="header-nav-item dropdown js-menu-container">';
  new_link += '    <a class="header-nav-link name" href="/'+current_username+'" data-ga-click="Header, go to profile, text:username">';
  new_link += '      <img alt="@'+current_username+'" class="avatar" height="20" src="'+avatar_link+'" width="20">';
  new_link += '      <span class="css-truncate">';
  new_link += '        <span class="css-truncate-target">'+current_username+'</span>';
  new_link += '      </span>';
  new_link += '    </a>';
  new_link += '</li>';
  $('#user-links').prepend(new_link);
};

var addExplore = function() {
  $('.header-nav.left').prepend('<li class="header-nav-item"><a href="/explore" class="js-selected-navigation-item header-nav-link">Explore</a></li>');
};

var addStars = function() {
  $('.header-nav.left').append('<li class="header-nav-item"><a href="/stars" class="js-selected-navigation-item header-nav-link">Stars</a></li>');
};

var couldGotoTop = function() {
  $('body').append('<span title="Goto top" id="goto-top" style="display:none;position:fixed;bottom:150px;cursor:pointer;" class="mega-octicon octicon-chevron-up"></span>');
  adjustGotoTopPos();
  $(window).resize(function() {
    adjustGotoTopPos();
  });
  $(window).scroll(function(){
    $(document).scrollTop() > 10 ? $("#goto-top").fadeIn(500) : $("#goto-top").fadeOut(500);
  });
  $("#goto-top").click(function(e){
    e.preventDefault();
    $(document.body).animate({scrollTop: 0},200);
  });
};

var adjustGotoTopPos = function() {
  var screenWidth = $(window).width()
  var containerWidth = 980 + 20 + 50
  var right = screenWidth > containerWidth ? (screenWidth - containerWidth) / 2 : 40
  $('#goto-top').css({'right': right + 'px'})
};

var addNetworkLink = function() {
  var graphsEle = $('li[aria-label="Graphs"]');
  if (graphsEle.length) {
    var networkEle = graphsEle.clone();
    networkEle.attr('aria-label', 'Network');
    networkEle.find('a').attr('href', networkEle.find('a').attr('href').replace('graphs', 'network'))
                        .attr('aria-label', 'Network')
                        .attr('data-selected-links', 'repo_graphs /AlphaHinex/my-github-style/graphs')
                        .removeClass('selected');
    networkEle.find('.octicon').removeClass('octicon-graph').addClass('octicon-globe');
    networkEle.find('.full-word').html('Network');

    graphsEle.after(networkEle);
  }
};

var hideGist = function() {
  $('a[href="https://gist.github.com/"]').hide();
};

var fixHeader = function() {
  $('.header').css({'min-width': '100%', 'position': 'fixed', 'z-index': '160'});
  $($('body>div')[3]).css({'position': 'relative', 'top': '49px'});
  $('.site-footer').css({'margin-top': '70px'})
};

var addYouKnow = function() {
  var starAEles = $('.pagehead-actions li a.social-count:gt(0):lt(2)');
  for (var i = 0; i < starAEles.length; i++) {
    var a = starAEles[i];
    var aCopy = $(a).clone();
    a.innerHTML = '<span class="counter">' + a.innerHTML + '</span>';
    a.title = 'All';
    aCopy.attr('href', aCopy.attr('href') + '/you_know');
    aCopy.attr('title', 'You know');
    aCopy.text('');
    // TODO get actual count
    aCopy.append('<span class="counter">' + 0 + '</span>');
    $(a).after(aCopy);
  }
};