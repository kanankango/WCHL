// contentScript.js

const FIELD_MAP = {
  name: ['name', 'fullName', 'fullname'],
  email: ['email', 'userEmail'],
  phone: ['phone', 'mobile', 'contact'],
  github: ['github', 'githubLink'],
  linkedin: ['linkedin', 'linkedinProfile'],
  portfolio: ['portfolio', 'website']
};

function findInputByLabel(label) {
  label = label.toLowerCase();
  for (const [key, aliases] of Object.entries(FIELD_MAP)) {
    if (aliases.some(alias => label.includes(alias))) {
      // Try to find input by name, id, or placeholder
      const selector = `input[name*="${key}"],input[id*="${key}"],input[placeholder*="${key}"]`;
      const el = document.querySelector(selector);
      if (el) return el;
    }
  }
  return null;
}

function autofillFields(credentials) {
  credentials.forEach(cred => {
    const input = findInputByLabel(cred.label);
    if (input) {
      input.value = cred.value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'AUTOFILL' && Array.isArray(msg.credentials)) {
    autofillFields(msg.credentials);
  }
}); 