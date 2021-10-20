let button = document.querySelector('#submit');
let removeButton = document.querySelector('#remove');
let removeAllButton = document.querySelector('#remove-all');

removeButton.onclick = function() {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      from: 'injectcss',
      message: 'remove-all',
    }, function(response) {
      if (response) {
        console.log("Response message for remove all: " + JSON.stringify(response));
      }
    });
    return true;
  });
}

removeButton.onclick = function() {
  let selectorBox = document.querySelector('#selector');
  let selector = selectorBox.value;

  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      from: 'injectcss',
      message: 'remove',
      selector: selector
    }, function(response) {
      if (response) {
        console.log("Response recevied for remove: " + JSON.stringify(response));
      }
    });
    return true;
  });
}

button.onclick = submitRule;

function submitRule() {
  let selectorBox = document.querySelector('#selector');
  let ruleBox = document.querySelector('#rule');
  let valueBox = document.querySelector('#value');

  let selector = selectorBox.value;
  let rule = ruleBox.value;
  let value = `"${valueBox.value}"`;


  console.log(`Rule submitted ${selector} { ${rule}: ${value}; }`);

  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      from: 'injectcss',
      message: 'inject',
      selector: selector,
      rule: rule,
      value: value
    }, function(response) {
      if (response) {
        console.log("Response recevied for inject: " + JSON.stringify(response));
      }
    });
    return true;
  });
}
