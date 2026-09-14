const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const welcome = document.getElementById("welcome");
const newChatBtn = document.getElementById("newChatBtn");
const clearBtn = document.getElementById("clearBtn");


// ========================================
// SEND MESSAGE
// ========================================

async function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) {
        return;
    }


    // Remove welcome screen
    if (welcome) {
        welcome.remove();
    }


    // Display user's message
    addMessage("You", text, "user");


    // Clear input
    messageInput.value = "";

    resizeTextarea();


    // Disable button while waiting
    sendBtn.disabled = true;


    // Show typing indicator
    const typingMessage = showTyping();


    try {

        /*
         * Send the user's message to FastAPI.
         *
         * Your backend should provide an endpoint:
         *
         * POST /api/chat
         *
         * Expected request:
         *
         * {
         *     "message": "Hello"
         * }
         *
         * Expected response:
         *
         * {
         *     "response": "Hello! How can I help?"
         * }
         */

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });


        if (!response.ok) {
            throw new Error("Server error");
        }


        const data = await response.json();


        // Remove typing indicator
        typingMessage.remove();


        // Display Gemini's response
        addMessage(
            "Gemini",
            data.response,
            "bot"
        );


    } catch (error) {

        typingMessage.remove();

        addMessage(
            "Gemini",
            "Sorry, something went wrong while contacting the server.",
            "bot"
        );

        console.error(error);

    } finally {

        sendBtn.disabled = false;

        messageInput.focus();

    }

}


// ========================================
// ADD MESSAGE
// ========================================

function addMessage(sender, text, type) {

    const message = document.createElement("div");

    message.className = `message ${type}-message`;


    const avatar = document.createElement("div");

    avatar.className =
        `avatar ${type === "user"
            ? "user-avatar"
            : "bot-avatar"}`;

    avatar.textContent =
        type === "user"
            ? "U"
            : "✦";


    const content = document.createElement("div");

    content.className = "message-content";


    const name = document.createElement("div");

    name.className = "message-name";

    name.textContent = sender;


    const textElement = document.createElement("div");

    textElement.textContent = text;


    content.appendChild(name);

    content.appendChild(textElement);


    message.appendChild(avatar);

    message.appendChild(content);


    messages.appendChild(message);


    scrollToBottom();
}


// ========================================
// TYPING INDICATOR
// ========================================

function showTyping() {

    const message = document.createElement("div");

    message.className = "message bot-message";


    message.innerHTML = `
        <div class="avatar bot-avatar">
            ✦
        </div>

        <div class="message-content">

            <div class="message-name">
                Gemini
            </div>

            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    `;


    messages.appendChild(message);

    scrollToBottom();


    return message;
}


// ========================================
// SCROLL
// ========================================

function scrollToBottom() {

    messages.scrollTop = messages.scrollHeight;

}


// ========================================
// TEXTAREA AUTO RESIZE
// ========================================

function resizeTextarea() {

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 150) + "px";

}


messageInput.addEventListener(
    "input",
    resizeTextarea
);


// ========================================
// ENTER TO SEND
// ========================================

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ========================================
// SEND BUTTON
// ========================================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ========================================
// SUGGESTIONS
// ========================================

document.querySelectorAll(".suggestion").forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                messageInput.value =
                    this.textContent.trim();

                resizeTextarea();

                messageInput.focus();

            }
        );

    }
);


// ========================================
// NEW CHAT
// ========================================

newChatBtn.addEventListener(
    "click",
    function () {

        location.reload();

    }
);


// ========================================
// CLEAR CHAT
// ========================================

clearBtn.addEventListener(
    "click",
    function () {

        location.reload();

    }
);
