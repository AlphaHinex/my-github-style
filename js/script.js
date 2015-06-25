 $(document).ready(function () {

  // For styling
  $('body').attr('id', 'github-menu-back');

  // If user is logged in
  if ($('.header').hasClass('header-logged-in')) {
    chrome.storage.sync.get('profile', function(val) {
      if(val && val['profile'] !== 'false') {
        oldMenuBack();
      }
    });

    chrome.storage.sync.get('explore', function(val) {
      if(val && val['explore'] !== 'false') {
        addExplore();
      }
    });

    chrome.storage.sync.get('stars', function(val) {
      if(val && val['stars'] !== 'false') {
        addStars();
      }
    });

    chrome.storage.sync.get('gototop', function(val) {
      if(val && val['gototop'] !== 'false') {
        couldGotoTop();
      }
    });

    chrome.storage.sync.get('network', function(val) {
      if(val && val['network'] !== 'false') {
        addNetworkLink();
      }
    });
  };
});

function oldMenuBack() {
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
}

function addExplore() {
  $('.header-nav.left').prepend('<li class="header-nav-item"><a href="/explore" class="js-selected-navigation-item header-nav-link">Explore</a></li>');
}

function addStars() {
  $('.header-nav.left').append('<li class="header-nav-item"><a href="/stars" class="js-selected-navigation-item header-nav-link">Stars</a></li>');
}

function couldGotoTop() {
  $('body').append('<a href="#" title="Goto top" id="goto-top" style="display:none;position:fixed;bottom:40px;right:40px;">Goto top</a>');
  $(window).scroll(function(){
    $(document).scrollTop() > 10 ? $("#goto-top").fadeIn(500) : $("#goto-top").fadeOut(500);
  });
  $("#goto-top").click(function(e){
    e.preventDefault();
    $(document.body).animate({scrollTop: 0},200);
  });
}

function addNetworkLink() {
  var graphsEle = $('li[aria-label="Graphs"]');
  var networkEle = $('li[aria-label="Graphs"]').clone();
  networkEle.attr('aria-label', 'Network');
  var networkLink = networkEle.find('a').attr('href').replace('graphs', 'network');
  networkEle.find('a').attr('href', networkLink)
            .attr('aria-label', 'Network')
            .attr('data-selected-links', 'network ' + networkLink)
            .removeClass('selected');
  networkEle.find('.octicon').removeClass('octicon-graph').addClass('octicon-globe');
  networkEle.find('.full-word').html('Network');
  graphsEle.after(networkEle);
}