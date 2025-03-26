const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');
const checkButton = document.getElementById('check');  // Ensure button reference

// Store in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clear local storage
function clearStorage() {
  localStorage.clear();
}

// Generate SHA256 hash
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Retrieve or generate a SHA256 hash for a random 3-digit number
async function getSHA256Hash() {
  let cachedHash = retrieve('sha256');
  if (cachedHash) return cachedHash;

  const randomNum = getRandomNumber(MIN, MAX).toString();
  console.log("Generated Number:", randomNum);  // Debugging

  cachedHash = await sha256(randomNum);
  store('sha256', cachedHash);
  return cachedHash;
}

// Main function to display SHA256 hash
async function main() {
  sha256HashView.innerHTML = 'Generating Hash...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Function to validate and check the user input
async function test() {
  console.log("Check button clicked!");

  const pin = pinInput.value.trim();
  console.log("Entered PIN:", pin);

  if (pin.length !== 3 || isNaN(pin)) {
    resultView.innerHTML = '💡 Enter a valid 3-digit number!';
    resultView.classList.remove('hidden');
    return;
  }

  const hashedPin = await sha256(pin);
  console.log("Hashed PIN:", hashedPin);

  const storedHash = sha256HashView.innerHTML.trim();
  console.log("Stored Hash:", storedHash);

  if (hashedPin === storedHash) {
    resultView.innerHTML = '🎉 Success! Correct Guess!';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Incorrect Guess! Try Again.';
  }

  resultView.classList.remove('hidden');
}

// Ensure input only accepts numbers
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach event listener when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  checkButton.addEventListener('click', test);
  main();
});
