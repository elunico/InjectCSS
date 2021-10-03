let button = document.querySelector('#submit');

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
        console.log("Response recevied: " + JSON.stringify(response));
      }
    });
    return true; 
  });
}
