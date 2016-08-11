/*global chrome*/

var patterns;

function blockRequest(details) {
  // eslint-disable-next-line no-console
  console.log('Blocked: ', details.url);
  return {
    cancel: true
  };
}

function updateFilters(/*urls*/) {
  // eslint-disable-next-line no-console
  console.info('Updating...');

  if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);

  if (patterns.length) {
    chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
      urls: patterns
    }, ['blocking']);
    // eslint-disable-next-line no-console
    console.info('Using patterns:');
    for (var p in patterns) {
      // eslint-disable-next-line no-console
      console.info(patterns[p]);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('No patterns defined.');
  }

  // eslint-disable-next-line no-console
  console.info('Updated!');
}

function load(callback) {
  chrome.storage.sync.get('blocked_patterns', function(data) {
    callback(data['blocked_patterns'] || []);
  });
}

// eslint-disable-next-line no-unused-vars
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
