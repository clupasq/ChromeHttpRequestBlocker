function blockRequest(details) {
  if (probability > Math.random()) {
    console.log("Blocked: ", details.url);
    return {
      cancel: true
    };  
  }
  console.log("Not blocked: ", details.url);
  return {
    cancel: false
  };
}

function isValidPattern(urlPattern) {
  var validPattern = /^(file:\/\/.+)|(https?|ftp|\*):\/\/(\*|\*\.([^\/*]+)|([^\/*]+))\//g;
  return !!urlPattern.match(validPattern);
}

function updateFilters(urls) {
  if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  }

  var validPatterns = patterns.filter(isValidPattern);

  if (validPatterns.length) {
    try{
      chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
        urls: validPatterns
      }, ['blocking']);
    } catch (e) {
      console.error(e);
    }
  }
}

function load(callback) {
  chrome.storage.sync.get(['blocked_patterns', 'probability'], function(data) {
    callback(data['blocked_patterns'] || [], data['probability'] || 1);
  });
}

function save(newPatterns, newProbability, callback) {
  patterns = newPatterns;
  probability = newProbability;

  chrome.storage.sync.set({
    'blocked_patterns': newPatterns,
    'probability': probability
  }, function() {
    updateFilters();
    callback.call();
  });
}

load(function(pat, prob) {
  patterns = pat;
  probability = prob;
  updateFilters();
});



