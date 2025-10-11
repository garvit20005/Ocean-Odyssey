import { fishSpecies } from './fishData.js';
import { oceanFacts } from './oceanFacts.js';
import { oceanResponses } from './chatBotData.js';

// Create Bubble Background
function createBubbles() {
  const container = document.getElementById('bubble-container');
  const bubbleCount = 30;
  
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = Math.random() * 60 + 20;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.animationDuration = (Math.random() * 10 + 10) + 's';
    bubble.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(bubble);
  }
}

createBubbles();

document.addEventListener("DOMContentLoaded", () => {

  // --- Modal functionality ---
  const modal = document.getElementById("infoModal");
  const modal_title = document.getElementById("modalTitle");
  const modal_text = document.getElementById("modalText");
  const closeBtn = document.getElementsByClassName("close-modal")[0];

  document.querySelectorAll(".hotspot").forEach(btn => {
    btn.addEventListener("click", () => {
      modal_title.textContent = btn.dataset.title;
      modal_text.textContent = btn.dataset.text;
      modal.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", e => { if(e.target === modal) modal.style.display = "none"; });

  // --- Card flip effect ---
  function addFlipEffect(container) {
    container.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", () => card.classList.toggle("is-flipped"));
    });
  }
  addFlipEffect(document.getElementById("default-cards"));
  addFlipEffect(document.getElementById("fish-container"));

  // --- Random fish generator ---
  function loadFish() {
    const container = document.getElementById("fish-container");
    container.innerHTML = "";
    const randomFish = fishSpecies.sort(() => 0.5 - Math.random()).slice(0, 12);

    randomFish.forEach(fish => {
      const card = document.createElement("article");
      card.classList.add("card");
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <img src="${fish.image}" alt="${fish.name}">
            <h3>${fish.name}</h3>
          </div>
          <div class="card-back">
            <p><strong>Family:</strong> ${fish.family}</p>
            <p><strong>Description:</strong> ${fish.description}</p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
    addFlipEffect(container);
  }

  document.getElementById("randomFishBtn").addEventListener("click", loadFish);

  // --- Random color generator ---
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
  }

  
  document.getElementById("randomizeFishesBtn").addEventListener("click", () => {
    document.querySelectorAll(".fish").forEach(fish => {
      fish.style.background = `linear-gradient(90deg, ${getRandomColor()}, ${getRandomColor()})`;
    });

    const hotspots = document.querySelectorAll(".hotspot");
    hotspots.forEach(hotspot => {
      const fact1 = oceanFacts[Math.floor(Math.random() * oceanFacts.length)];
      let fact2;
      do {
        fact2 = oceanFacts[Math.floor(Math.random() * oceanFacts.length)];
      } while (fact2 === fact1);
      hotspot.dataset.title = "Mysterious Fact";
      hotspot.dataset.text = `1️⃣ ${fact1}\n2️⃣ ${fact2}`;
      hotspot.classList.add("flash");
      setTimeout(() => hotspot.classList.remove("flash"), 800);
    });
  });

  // Auto color change when animation repeats
  function randomGradient() {
    const randomColor = () => "#" + Math.floor(Math.random()*16777215).toString(16);
    return `linear-gradient(90deg, ${randomColor()}, ${randomColor()})`;
  }

  document.querySelectorAll(".fish").forEach(fish => {
    fish.addEventListener("animationiteration", () => {
      fish.style.background = randomGradient();
    });
  });

  // --- Ocean Chatbot ---
  const chatHeader = document.getElementById("chatHeader");
  const chatBody = document.getElementById("chatBody");
  const messages = document.getElementById("messages");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.textContent = text;
    msg.className = sender;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function botReply(userText) {
    userText = userText.toLowerCase();
    let found = false;
    
    for (const entry of oceanResponses) {
      if (entry.keywords.some(k => userText.includes(k))) {
        addMessage(entry.response, "bot");
        found = true;
        break;
      }
    }

    if (!found) {
      const defaultFacts = [
        "The ocean is vast and mysterious, covering most of our planet.",
        "Did you know some fish can fly above water for short distances?",
        "Many ocean creatures are still undiscovered by humans."
      ];
      const answer = defaultFacts[Math.floor(Math.random() * defaultFacts.length)];
      addMessage(answer, "bot");
    }
  }

  // Toggle chat
  chatHeader.addEventListener("click", () => {
    chatBody.style.display = chatBody.style.display === "flex" ? "none" : "flex";
  });

  // Send message
  sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    userInput.value = "";
    setTimeout(() => botReply(text), 600);
  });

  // Enter key
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

});