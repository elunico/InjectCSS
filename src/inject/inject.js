chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      chrome.storage.sync.get(['rules'], (items) => {
        console.log(items);
        for (let rule of items['rules']) {
          let elts = document.querySelectorAll(rule.selector);
          for (let elt of elts) {
            elt.style[rule.rule] = rule.value;
          }
        }
      });

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js");
      // ----------------------------------------------------------

    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendRepsonse) {

      console.log(JSON.stringify(request))
      if (request.from === 'injectcss' && request.message === 'inject') {

        chrome.storage.sync.get(['rules'], (items) => {
          console.log(items);
          items['rules'] = !items['rules'] ? [] : items['rules'];
          items['rules'].push({
            selector: request.selector,
            rule: request.rule,
            value: request.value
          })

          chrome.storage.sync.set(items, function() {
            sendRepsonse({
              status: 'ok',
              message: 'Injected Rule'
            });
          });
        })


        let elts = document.querySelectorAll(request.selector);
        for (let elt of elts) {
          elt.style[request.rule] = request.value;
        }
        return true;
      }

      if (request.from === 'injectcss' && request.message === 'remove') {

        let removed = false;
        chrome.storage.sync.get(['rules'], (items) => {
          console.log(items);
          items['rules'] = !items['rules'] ? [] : items['rules'];
          for (let i = items['rules'].length - 1; i >= 0; i--) {
            let rule = items['rules'][i];
            if (rule.selector == request.selector) {
              removed = true;
              items['rules'].splice(i, 1);
            }
          }

          chrome.storage.sync.set(items, function() {
            if (removed)
              sendRepsonse({
                status: 'ok',
                message: 'Removed selector'
              });
            else
              sendRepsonse({
                status: 'ok',
                message: 'No Selector Removed'
              });
          });
        });

        if (request.from === 'injectcss' && request.message === 'remove-all') {

          let removed = false;
          chrome.storage.sync.get(['rules'], (items) => {
            console.log(items);
            items['rules'] = [];

            chrome.storage.sync.set(items, function() {
              if (removed)
                sendRepsonse({
                  status: 'ok',
                  message: 'Removed all rules'
                });
              else
                sendRepsonse({
                  status: 'ok',
                  message: 'No rules removed'
                });
            });
          });


          let elts = document.querySelectorAll(request.selector);
          for (let elt of elts) {
            delete elt.style[request.rule];
          }
          return true;
        }

        console.log('Listener ready!');
      }
    });
  }, 10);
});
