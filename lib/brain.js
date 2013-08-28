var wpAdminHide = {

	active: false,

	/*
	 * Adds a domain name to localStorage and switches icon to on position.
	 */
	addD: function(d) {
		localStorage[d] = true;
		console.log(d + " added.");
		wpAdminHide.toggleIcon(true);
	},

	/*
	 * Removes a domain from localStorage and switches icon to off position.
	 */
	remD: function(d){
		localStorage.removeItem(d);
		console.log(d + " removed.");
		wpAdminHide.toggleIcon(false);
	},

	/*
	 * Checks for the existence of a localStorage item that matches the domain passed as the first
	 * argument. Second and third arguments are what to do if there is or isn't a match, respectively.
	 */	
	chkD: function( d, pass, fail ) {
		if (localStorage[d]) {
			pass(d);
		}
		else{
			fail(d);
		}
	},

	/*
	 * Gets the active window's domain name from Chrome. Provides a callback function along with pass
	 * and fail pass-throughs for some asynchronous fun. This might be poor or unnesesary implemetation
	 * of async but I need to learn this stuff somehow!
	 */
	getD: function(cb, pass, fail){

		//Get url from active tab, remove path but keep protocol, domain, tld, and port
		chrome.tabs.query({'active': true, 'currentWindow': true }, function (tabs) {

			var url = tabs[0].url;
			var arr = url.split("/");
			var result = arr[0] + "//" + arr[2];
			
			// Pass result and pass/fail functions on to the requested callback funtion!
			cb( result, pass, fail );
			
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


//Listener for browser button clickage
chrome.browserAction.onClicked.addListener(function (tab) {

		wpAdminHide.getD( 		/* 1. Get the domain name from the Chrome API 		*/
			wpAdminHide.chkD, 	/* 2. See if the domain name is in localStorage 	*/
			wpAdminHide.remD, 	/* 		a. It is! We must want to remove it			*/
			wpAdminHide.addD 	/* 		b. Nope. Lets add it.						*/
		);

});

//@TODO Check the domain name when a page is loaded

//@TODO Check the domain when the tab is changed?

//@TODO Actually inject css and/or JS into a page