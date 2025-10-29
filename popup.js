const btn = document.getElementById("toggle");

// Helper: get current active tab (needs "tabs" permission)
async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Toggle the class and return the new state from the page
async function toggleLasagna(tabId) {
  const [{ result: isActive }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const html = document.documentElement;
      html.classList.toggle("lasagna-active");
      return html.classList.contains("lasagna-active");
    }
  });
  return isActive;
}

// Read current state from the page (without changing it)
async function readState(tabId) {
  const [{ result: isActive }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => document.documentElement.classList.contains("lasagna-active")
  });
  return isActive;
}

function render(isActive) {
  btn.textContent = isActive ? "Turn Off Lasagna" : "Turn On Lasagna";
  btn.classList.toggle("off", !isActive);
}

async function init() {
  const tab = await getActiveTab();
  if (!tab?.url?.startsWith("https://app.asana.com/")) {
    btn.textContent = "Open app.asana.com";
    btn.classList.add("off");
    btn.disabled = true;
    return;
  }
  render(await readState(tab.id));

  btn.addEventListener("click", async () => {
    render(await toggleLasagna(tab.id));
  });
}

init();
