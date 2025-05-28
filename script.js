const chatDisplay = document.getElementById('chat-display');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const speakBtn = document.getElementById('speak-btn');
const eyeBtn = document.getElementById('eye-mode');

let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'hi-IN';
  recognition.continuous = false;
  recognition.interimResults = false;
}

sendBtn.onclick = sendMessage;
speakBtn.onclick = startListening;
eyeBtn.onclick = toggleEyeProtection;

function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  appendMessage('👦', msg);
  userInput.value = '';
  generateAIResponse(msg);
}

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatDisplay.appendChild(msg);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function startListening() {
  if (recognition) {
    recognition.start();
    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      sendMessage();
    };
  } else {
    alert('Speech recognition not supported');
  }
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'hi-IN';
  window.speechSynthesis.speak(utter);
}

function toggleEyeProtection() {
  document.body.classList.toggle('eye-protection');
}

async function generateAIResponse(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are Vidyarthi AI, a helpful, friendly and fun educational assistant for Indian students. Respond in Hinglish or Hindi with easy-to-understand, creative and fun explanations. Include emojis, rhymes or examples if helpful.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  appendMessage('🤖', reply);
  speak(reply);
}