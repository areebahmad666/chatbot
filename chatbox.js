const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input button");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  // let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<i class="fa-solid fa-robot"></i><p>${message}</p>`;
  let chatContent = className === "outgoing" ? `<p></p>` : `<i class="fa-solid fa-robot"></i><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
}

const generateResponse = (incomingChatLi ) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": userMessage
        },
        {
          "role": "user",
          "content": "Hello!"
        }
      ]
    })
  }

  fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
    console.log(data);
    messageElement.textContent = data.choices[0].message.content;
    console.log(messageElement.textContent);
  }).catch((error) => {
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Somethins went wrong. Please try again.";
  }).finally(() =>{
    chatbox.scrollTo(0, chatbox.scrollHeight);
  })
}

const handleChat = () => {
  userMessage = chatInput.value.trim();
  // console.log(userMessage);
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking", "incoming")
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);

}

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);



