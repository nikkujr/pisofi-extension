browser.runtime.onMessage.addListener(function () {
  console.log('Hello from the background')
})

// listen for our browerAction to be clicked
chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.id, {
		file: 'js/inject.js'
	});
});
