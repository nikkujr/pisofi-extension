(function() {
    'use strict';
    console.log("PisoFi Script Injected");
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    if (this.responseURL.indexOf('/jwt/verify') > -1) {
                        var div = document.createElement('div');
                        div.style.position = 'fixed';
                        div.style.top = 0;
                        div.style.right = 0;
                        div.style.background = "#FFFFE0";
                        div.style.border = "2px solid #FFE4B5";
                        div.style.padding = "5px 10px";
                        div.style.zIndex = "9999999"
                        div.style.fontSize = "3em"

                        div.textContent = 'Synched to PisoFi Chrome Extension!';
                        document.body.appendChild(div);

                        window.postMessage({ sender: 'pisofi_access_token', data: this.responseText},'*');

                    }
                    if (this.responseURL.indexOf('/jwt/login') > -1) {
                        window.postMessage({ sender: 'pisofi_token', data: this.responseText},'*');
                    }
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();