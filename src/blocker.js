var currentPatterns = [];

function blockRequest(details) {
  console.log("Blocked: ", details.url);
  return {
    cancel: true
  };
}

function isValidPattern(urlPattern) {
  var validPattern = /^(file:\/\/.+)|(https?|ftp|\*):\/\/(\*|\*\.([^\/*]+)|([^\/*]+))\//g;
  return !!urlPattern.match(validPattern);
}

function updateFilters() {
  if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  }

  var validPatterns = currentPatterns.filter(isValidPattern);

  if (patterns.length) {
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
  chrome.storage.sync.get('blocked_patterns', function(data) {
    callback(data['blocked_patterns'] || []);
  });
}

function save(newPatterns, callback) {
  currentPatterns = newPatterns;
  chrome.storage.sync.set({
    'blocked_patterns': newPatterns
  }, function() {
    updateFilters();
    callback.call();
  });
}

load(function(patterns) {
  currentPatterns = patterns;
  updateFilters();
});



