var wpAdminHide = {

	active: false,

	/*
	 * Adds a domain name to localStorage
	 */
	addD: function(d) {
		localStorage[d] = true;
		console.log(d + " added.");
	},

	/*
	 * Removes a domain from localStorage
	 */
	remD: function(d){
		localStorage.removeItem(d);
		console.log(d + " removed.");
	},

	/*
	 * Checks for the existence of a localStorage item that matches the domain passed as the first
	 * argument. Second and third arguments are what to do if there is or isn't a match, respectively.
	 */
	chkD: function( tabId, pass, fail ) {
		chrome.tabs.get( tabId, function(tab){
			d = tab.url.split("/")[2];
			if (localStorage[d]) {
				pass(d);
			}
			else{
				fail(d);
			}
		});
	},

	removeBar: function( tabId ){
		chrome.tabs.executeScript(
			tabId,
			{
				code: "document.getElementById('wpadminbar').style.display='none';document.getElementsByTagName('html')[0].style.setProperty('margin-top', '0px', 'important');document.getElementsByTagName('html')[0].style.setProperty('padding-top', '0px', 'important');",
				runAt: "document_idle",
				allFrames: true
			},
			function(){
				wpAdminHide.toggleIcon(true);
				console.log("Bar removed!");
		});
	},

	restoreBar: function( tabId ){
		chrome.tabs.executeScript(
			tabId,
			{
				code: "document.getElementById('wpadminbar').removeAttribute('style');document.getElementsByTagName('html')[0].removeAttribute('style');",
				runAt: "document_idle",
				allFrames: true
			},
			function(){
				wpAdminHide.toggleIcon(false);
				console.log("Bar restored!");
		});

	},

	/*
	 * This could very well become outdated but I'm rolling with it for now. Function takes a boolean 
	 * parameter and switches the icon to on or off while also updating the 'active' variable.
	 */
	toggleIcon: function( state ){
		if(state){
			//Change Icon
					chrome.browserAction.setIcon({
							"path": "img/icon19_1.png"
						}, function () {
							this.active = true;
						});
		}
		else{
			chrome.browserAction.setIcon({
						"path": "img/icon19_0.png"
					}, function () {
						this.active = false;
					});
		}
	}

};


/* 
 * Listener for browser action button clickage. Checks the active tab against localstorage and toggles
 * the state of the plugin accordingly
 */
chrome.browserAction.onClicked.addListener( function ( tab ) {
		wpAdminHide.chkD(
			tab.id,
			function(d){
				wpAdminHide.remD(d);
				wpAdminHide.restoreBar(tab.id);
			},
			function(d){
				wpAdminHide.addD(d);
				wpAdminHide.removeBar(tab.id);
			}
		);
});

/*
 * Keep the icon up to date based on whether or not the domain exists in local storage.
 * Going to assum that the hiding was handled on tab load so this is just for keeping up 
 * appearances.
 */
chrome.tabs.onActivated.addListener( function( tab ){
	wpAdminHide.chkD(
		tab.tabId,
		function(){
			wpAdminHide.toggleIcon(true);
		},
		function(){
			wpAdminHide.toggleIcon(false);
		});

});

chrome.tabs.onUpdated.addListener( function( tabId, data, tab ){
	wpAdminHide.chkD(
			tabId,
			function(d){
				wpAdminHide.removeBar(tabId);
			},
			function(d){}
		);
});