chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.local.set({ url: '', times: 100 });
  }
});

chrome.runtime.onMessage.addListener(async ({ url, times }) => {
  const tab = await chrome.tabs.create({ url });

  for (let i = 1; i <= times; i++) {
    setTimeout(async () => {
      const currentTab = await chrome.tabs.query({});

      if (!currentTab || !currentTab.length) {
        return;
      }

      currentTab.forEach(({ id: currentTabId }) => {
        if (tab.id === currentTabId) {
          chrome.tabs.reload(tab.id);
        }
      });
    }, i * 3000);
  }

  setTimeout(async () => {
    const currentTab = await chrome.tabs.query({});

    if (!currentTab || !currentTab.length) {
      return;
    }

    currentTab.forEach(({ id: currentTabId }) => {
      if (tab.id === currentTabId) {
        chrome.tabs.remove(tab.id);
      }
    });
  }, times * 3000 + 3000);
});