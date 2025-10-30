// Automatically enable Lasagna mode by default
document.documentElement.classList.add("lasagna-active");

// A utility to insert arbitrary elements after existing DOM nodes
function insert(selector, createNode, position = 'afterend') {
  // Helper to insert once
  const insertOnce = (el) => {
    // Prevent duplicate insertions
    if (el.dataset[`inserted_${position}`]) return;
    const node = createNode();
    node.dataset.insertedBy = 'insert';
    el.insertAdjacentElement(position, node);
    el.dataset[`inserted_${position}`] = 'true';
  };

  // Handle existing elements immediately
  document.querySelectorAll(selector).forEach(insertOnce);

  // Watch for future elements (SPA-safe)
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(selector)) insertOnce(node);
        node.querySelectorAll?.(selector).forEach(insertOnce);
      }
    }
  });

  mo.observe(document.body, { childList: true, subtree: true });

  return mo; // You can later call mo.disconnect() if needed
}

// A toggle to show/hide fields in a task
insert('.SubtleHeartButton.TaskPaneToolbar-button', () => {
  const label = document.createElement('label');
  label.classList.add('lasagna-toggle-task-fields')
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(' Expand fields'));
  return label;
}, 'beforebegin');
