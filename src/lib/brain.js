var wpAdminHide = {

  /*
   * Adds a domain name to Chrome storage
   */
  addD: function(d) {
    var save = {};
    save[d] = true;
    chrome.storage.sync.set(save, function(result) {
      console.log(d, "added to storage, admin bar removed.");
    });
  },

  /*
   * Removes a domain from Chrome storage
   */
  remD: function(d) {
    chrome.storage.sync.remove(d, function() {
      console.log(d, "removed from storage, admin bar restored.");
    });
  },

  /*
   * Checks for the existence of a Chrome storage item that matches the domain passed as the first
   * argument. Second and third arguments are what to do if there is or isn't a match, respectively.
   */
  chkD: function(tabId, pass, fail) {
    chrome.tabs.get(tabId, function(tab) {
      if(tab.url.indexOf('chrome') == 0){
        console.error('can\'t run on chrome pages, sorry :(');
      }else{
        d = tab.url.split("/")[2];
        chrome.storage.sync.get(d, function(result){
          if (result[d]) {
            pass(d);
          } else {
            fail(d);
          }
        });
      }
    });
  },

  removeBar: function(tabId) {
    chrome.tabs.executeScript(
      tabId, {
        code: [
          "document.getElementById('wpadminbar').style.display = 'none';",
          "document.getElementsByTagName('html')[0].style.setProperty('margin-top', '0px', 'important');",
          "document.getElementsByTagName('html')[0].style.setProperty('padding-top', '0px', 'important');",
          "document.getElementsByTagName('body')[0].classList.remove('admin-bar');"
        ].join(''),
        runAt: "document_idle",
        allFrames: true
      },
      function() {
        wpAdminHide.toggleIcon(true);
      });
  },

  restoreBar: function(tabId) {
    chrome.tabs.executeScript(
      tabId, {
        code: [
          "document.getElementById('wpadminbar').removeAttribute('style');",
          "document.getElementsByTagName('html')[0].removeAttribute('style');",
          "document.getElementsByTagName('body')[0].classList.add('admin-bar');"
        ].join(''),
        runAt: "document_idle",
        allFrames: true
      },
      function() {
        wpAdminHide.toggleIcon(false);
      });
  },

  /*
   * This could very well become outdated but I'm rolling with it for now. Function takes a boolean
   * parameter and switches the icon to on or off while also updating the 'active' variable.
   */
  toggleIcon: function(state) {
    if (state) {
      chrome.browserAction.setIcon({
        path: {
          "19": "img/icon19_1.png",
          "38": "img/icon38_1.png"
        }
      });
    } else {
      chrome.browserAction.setIcon({
        path: {
          "19": "img/icon19_0.png",
          "38": "img/icon38_0.png"
        }
      });
    }
  }

};

/* 
 * Listener for browser action button clickage. Checks the active tab against Chrome storage
 * and toggles the state of the plugin accordingly.
 */
chrome.browserAction.onClicked.addListener(function(tab) {
  wpAdminHide.chkD(
    tab.id,
    function(d) {
      wpAdminHide.remD(d);
      wpAdminHide.restoreBar(tab.id);
    },
    function(d) {
      wpAdminHide.addD(d);
      wpAdminHide.removeBar(tab.id);
    }
  );
});

/*
 * Keep the icon up to date based on whether or not the domain exists in local storage.
 * Going to assume that the hiding was handled on tab load so this is just for keeping up
 * appearances.
 */
var updateBrowserIcon = function(tab) {
  var id = tab.tabId || tab.id;
  wpAdminHide.chkD(
    id,
    function() {
      wpAdminHide.toggleIcon(true);
    },
    function() {
      wpAdminHide.toggleIcon(false);
    });
};

// Update icon when tab is changed within a single window
chrome.tabs.onActivated.addListener(updateBrowserIcon);

// Update icon when window focus changes
chrome.windows.onFocusChanged.addListener(function(windowId){
  chrome.tabs.query({windowId: windowId, active: true}, function(tab){
    updateBrowserIcon(tab['0']);
  });
});

/**
 * This listener fires each time the user loads a new page. If the domain is recognized
 * then the bar removal script is fired.
 */
chrome.tabs.onUpdated.addListener(function(tabId, data, tab) {
  wpAdminHide.chkD(
    tabId,
    function(d) {
      wpAdminHide.removeBar(tabId);
    },
    function(d) {}
  );
});
