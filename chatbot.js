const WHATSAPP_NUMBER = "263788878312"; 
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Zems%20Cakes%20and%20Catering,%20I%20would%20like%20to%20place%20an%20order.`;


// Load memory
let chatMemory = JSON.parse(sessionStorage.getItem("chatMemory") || "[]");

const toggle = document.getElementById("chat-toggle");
toggle.style = `
  position: fixed; bottom: 20px; right: 20px;
  background:#000;color:#fff;font-size:26px;
  padding:14px;border-radius:50%;cursor:pointer;z-index:9999;
`;

const box = document.createElement("div");
box.style = `
  position: fixed;
  bottom: 80px;
  right: 16px;
  width: 92vw;
  max-width: 360px;
  height: 70vh;
  max-height: 460px;
  background:#0b0b0b;
  color:#fff;
  border-radius:14px;
  display:none;
  flex-direction:column;
  z-index:9999;
  box-shadow:0 10px 40px rgba(0,0,0,.5);
  overflow:hidden;
`;

box.innerHTML = `
  <div style="padding:12px;border-bottom:1px solid #222;display:flex;justify-content:space-between">
    <strong>Site Assistant</strong>
    <span id="close-chat" style="cursor:pointer">✖</span>
  </div>

  <div id="msgs" style="
    flex:1;
    padding:12px;
    overflow-y:auto;
    overflow-x:hidden;
    font-size:14px;
    display:flex;
    flex-direction:column;">
  </div>


  <div style="display:flex;padding:10px;border-top:1px solid #222">
    <input id="chatInput" placeholder="Type a message..."
      style="flex:1;padding:8px;border-radius:8px;border:none"/>
    <button id="sendBtn" style="margin-left:6px;padding:8px 12px;border-radius:8px;border:none">➤</button>
  </div>
`;

document.body.appendChild(box);

toggle.onclick = () => {
  box.style.display = "flex";

  if (msgs.children.length === 0) {
    showWelcomeMessage();
  }
};


document.getElementById("close-chat").onclick = () => {
  box.style.display = "none";
  msgs.innerHTML = "";
  chatMemory = [];
  sessionStorage.removeItem("chatMemory");
};


const msgs = document.getElementById("msgs");
function renderMessage(text, from) {
  const div = document.createElement("div");
  div.style = `
    margin-bottom:8px;
    align-self:${from === "user" ? "flex-end" : "flex-start"};
    background:${from === "user" ? "#2563eb" : "#1f2937"};
    padding:8px 10px;
    border-radius:10px;
    max-width:80%;
  `;

  div.innerText = text;

  // ✅ WhatsApp handoff for bot messages
  if (
    from === "bot" &&
    /order|price|book|urgent|emergency|catering|cake/i.test(text)
  ) {
    const wa = document.createElement("a");
    wa.href = WHATSAPP_LINK;
    wa.target = "_blank";
    wa.innerText = "👉 Continue on WhatsApp";
    wa.style = `
      display:block;
      margin-top:6px;
      color:#22c55e;
      font-size:13px;
      text-decoration:none;
    `;
    div.appendChild(wa);
  }

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showWelcomeMessage() {
  renderMessage(
    "👋 Hi! Welcome to Zems Cakes & Catering. How can I help you today?",
    "bot"
  );
}


async function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  input.value = "";
  renderMessage(msg, "user");

  chatMemory.push({ role: "user", content: msg });


  const typing = document.createElement("div");
  typing.innerText = "typing...";
  typing.style = `
    font-size:12px;
    color:#9ca3af;
    margin:6px 0;
  `;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;


  const res = await fetch("./netlify/functions/chat", {
    method: "POST",
    body: JSON.stringify({
      message: msg,
      memory: chatMemory,
      siteContent: window.SITE_CONTENT,
      faqContent: window.FAQ_CONTENT
    })
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));



  const data = await res.json();

  // ❌ REMOVE TYPING
  typing.remove();

  // ✅ SHOW BOT REPLY
  renderMessage(data.reply, "bot");

  chatMemory.push({ role: "assistant", content: data.reply });
  sessionStorage.setItem("chatMemory", JSON.stringify(chatMemory));
}


document.getElementById("sendBtn").onclick = sendMessage;
document.getElementById("chatInput").addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
