function blockRequest(details) {
  console.log("Blocked: ", details.url);
  return {
    cancel: true
  };
}

function updateFilters(urls) {
  console.info('Updating...');

  if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);

  if (patterns.length) {
    chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
      urls: patterns
    }, ['blocking']);
    console.info('Using patterns:');
    for (p in patterns) {
      console.info(patterns[p]);
    }
  } else {
    console.info('No patterns defined yet.');
  }

  console.info('Updated!')
}

function load(callback) {
  chrome.storage.sync.get('blocked_patterns', function(data) {
    callback(data['blocked_patterns'] || []);
  });
}

function save(newPatterns, callback) {
  patterns = newPatterns;
  chrome.storage.sync.set({
    'blocked_patterns': newPatterns
  }, function() {
    updateFilters();
    callback.call();
  });
}

load(function(p) {
  patterns = p;
  updateFilters();
});
