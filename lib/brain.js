//Set click to false at beginning
var alreadyClicked = false;
//Declare a timer variable
var timer;

//Add Default Listener provided by chrome.api.*
chrome.browserAction.onClicked.addListener(function (tab) {
    //Check for previous click
    if (alreadyClicked) {
        //Yes, Previous Click Detected

        //Clear timer already set in earlier Click
        clearTimeout(timer);
        console.log("Double click");

        //Change Icon
        chrome.browserAction.setIcon({
            "path": "img/icon19_1.png"
        }, function () {
            console.log("Changed Icon for Double Click");
        });
		
		if (!localStorage.hideWPBar)
			localStorage.hideWPBar = 0;
		localStorage.hideWPBar = parseInt(localStorage.hideWPBar) + 1;
		alert(localStorage.hideWPBar);
		


        //Clear all Clicks
        alreadyClicked = false;
        return;
    }

    //Set Click to  true
    alreadyClicked = true;

    //Add a timer to detect next click to a sample of 250
    timer = setTimeout(function () {
        //No more clicks so, this is a single click
        console.log("Single click");

        //Chane Icon
        chrome.browserAction.setIcon({
            "path": "img/icon19_0.png"
        }, function () {
            console.log("Changed Icon for Single Click");
        });

        //Clear all timers
        clearTimeout(timer);

        //Ignore clicks
        alreadyClicked = false;
    }, 250);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete" && isInUserList(tab.url)) {
		var hi = chrome.extension.getURL ("lib/hello.js")
        chrome.tabs.executeScript(tabId, {file:hi}, function() {
            //script injected
        });
    }
});