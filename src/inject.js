(function() {
    console.log("Injector Running");
    
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('js/pisofi.js');
    s.onload = function() {
        console.log("Script Loaded");
    };
    (document.head || document.documentElement).appendChild(s);


    window.addEventListener("message", function(event) {
        if (event && event.data.sender == "pisofi_token") {
            let token = null;
            try {
                let data = JSON.parse(event.data.data);
                token = data.token;
                console.log(token);
            } catch(e) {
                console.log("ERROR", e);
            }

            if (token) {
               chrome.storage.local.set({token: token}, function() {
                   console.log("Token has been updated", token);
               });
            }
        }

        if (event && event.data.sender == "pisofi_access_token") {
            let token = null;
            try {
                let data = JSON.parse(event.data.data);
                token = data.token;
                console.log(token);
            } catch(e) {
                console.log("ERROR", e);
            }

            if (token) {
               chrome.storage.local.set({accessToken: token}, function() {
                   console.log("Access Token has been updated", token);
               });
            }
        }
    });
})();
