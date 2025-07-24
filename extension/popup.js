// popup.js
// UniIdent Autofill Extension

let principal = null;
let credentials = [];

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const mainSection = document.getElementById('main-section');
const viewDataBtn = document.getElementById('view-data-btn');
const autofillBtn = document.getElementById('autofill-btn');
const dataTable = document.getElementById('data-table');
const credentialsBody = document.getElementById('credentials-body');

// Mock getUserData (replace with @dfinity/agent call in production)
async function getUserData(principal) {
  // Simulate fetch from canister
  // Replace with real @dfinity/agent logic
  return [
    { label: 'Full Name', category: 'Personal', value: 'Alice Example' },
    { label: 'Email', category: 'Personal', value: 'alice@example.com' },
    { label: 'Phone', category: 'Personal', value: '+1234567890' },
    { label: 'GitHub', category: 'Social', value: 'https://github.com/alice' },
    { label: 'LinkedIn', category: 'Social', value: 'https://linkedin.com/in/alice' },
    { label: 'Portfolio', category: 'Web', value: 'https://alice.dev' }
  ];
}

function showCredentials(creds) {
  credentialsBody.innerHTML = '';
  creds.forEach(cred => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="border px-2 py-1">${cred.label}</td><td class="border px-2 py-1">${cred.category}</td><td class="border px-2 py-1">${cred.value}</td>`;
    credentialsBody.appendChild(tr);
  });
  dataTable.classList.remove('hidden');
}

loginBtn.onclick = async () => {
  // Simulate Internet Identity login
  principal = 'mock-principal-' + Math.random().toString(36).slice(2, 10);
  loginBtn.classList.add('hidden');
  logoutBtn.classList.remove('hidden');
  mainSection.classList.remove('hidden');
  credentials = await getUserData(principal);
};

logoutBtn.onclick = () => {
  principal = null;
  credentials = [];
  loginBtn.classList.remove('hidden');
  logoutBtn.classList.add('hidden');
  mainSection.classList.add('hidden');
  dataTable.classList.add('hidden');
};

viewDataBtn.onclick = () => {
  if (credentials.length) {
    showCredentials(credentials);
  }
};

autofillBtn.onclick = () => {
  if (!credentials.length) return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'AUTOFILL', credentials });
  });
}; 