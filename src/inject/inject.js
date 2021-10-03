chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js");
      // ----------------------------------------------------------

    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendRepsonse) {

      console.log(JSON.stringify(request))
      if (request.from === 'injectcss' && request.message === 'inject') {

        chrome.storage.sync.set({
          selector: request.selector,
          rule: request.rule,
          value: request.value
        }, function() {
          sendRepsonse({
            status: 'ok',
            message: 'Injected Rule'
          });
        });

        let elts = document.querySelectorAll(request.selector);
        for (let elt of elts) {
          elt.style[request.rule] = request.value;
        }
        return true;
      }

      console.log('Listener ready!');
    });
  }, 10);
});
