const STORAGE_KEY = "blocked_patterns";

const isValidPattern = (urlPattern) => {
  const validPattern = /^(file:\/\/.+)|(https?|ftp|\*):\/\/(\*|\*\.([^\/*]+)|([^\/*]+))\//g;
  return !!urlPattern.match(validPattern);
};

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
        document.getElementById("urlPatterns").value = (data[STORAGE_KEY] || []).join("\n");
    });

    const errorSpan = document.getElementById("error");
    const infoSpan = document.getElementById("info");
    let infoTimeout = null;

    const showError = (message) => {
        errorSpan.textContent = message;
    }

    const showInfo = (message) => {
        if (infoTimeout) {
            clearTimeout(infoTimeout);
        }
        infoSpan.textContent = message;
        setTimeout(() => {
            infoSpan.textContent = "";
        }, 2000);
    }

    document.getElementById("save").addEventListener("click", () => {
        showError("");
        const urlPatterns = document.getElementById("urlPatterns").value
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean);

        for (const pattern of urlPatterns) {
            if (!isValidPattern(pattern)) {
                showError(`Invalid pattern: "${pattern}"`);
                return;
            }
        }

        chrome.storage.sync.set({
            [STORAGE_KEY]: urlPatterns
        }, () => {
            showInfo("URL patterns saved!");
            updateRules();
        });
    });
});

const updateRules = () => {
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
        const urlPatterns = data[STORAGE_KEY] || [];
        const rules = urlPatterns.map((pattern, index) => ({
            "id": index + 1,
            "priority": 1,
            "action": { "type": "block" },
            "condition": {
                "urlFilter": pattern,
                "resourceTypes": ["main_frame", "sub_frame", "script", "image", "stylesheet", "object", "xmlhttprequest", "other"]
            }
        }));

        chrome.declarativeNetRequest.getDynamicRules((oldRules) => {
            const oldRuleIds = oldRules.map(rule => rule.id);
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: oldRuleIds,
                addRules: rules
            });

        });
    });
}

// Update rules on extension install/update
chrome.runtime.onInstalled.addListener(updateRules);
chrome.runtime.onStartup.addListener(updateRules);
