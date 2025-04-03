import { auth, db } from "./firebase-config.js";
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessage");
const logoutBtn = document.getElementById("logout");

let currentUser = null;

// Функция для форматирования времени
function formatTime(timestamp) {
    const date = timestamp.toDate();
    return date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
}

// Функция загрузки сообщений
function loadMessages() {
    const messagesQuery = query(collection(db, "chats"), orderBy("timestamp"));

    onSnapshot(messagesQuery, (snapshot) => {
        chatBox.innerHTML = "";
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", messageData.senderId === currentUser.uid ? "sent" : "received");

            // Добавляем текст и время
            messageElement.innerHTML = `
                <div class="text">@${messageData.sender}: ${messageData.text}</div>
                <div class="time">${formatTime(messageData.timestamp)}</div>
            `;

            // Кнопка удаления (если сообщение от текущего пользователя)
            if (messageData.senderId === currentUser.uid) {
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "❌";
                deleteButton.classList.add("delete-btn");
                deleteButton.onclick = async () => {
                    await deleteDoc(doc(db, "chats", doc.id));
                };
                messageElement.appendChild(deleteButton);
            }

            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight; // Автопрокрутка вниз
        });
    });
}

// Отправка сообщения
sendMessageBtn.addEventListener("click", async () => {
    const text = messageInput.value.trim();
    if (text === "" || !currentUser) return;

    await addDoc(collection(db, "chats"), {
        senderId: currentUser.uid,
        sender: currentUser.shortName,
        text: text,
        timestamp: new Date()
    });

    messageInput.value = "";
});

// Выход из аккаунта
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "auth.html";
});

// Проверка авторизации
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            currentUser = { uid: user.uid, shortName: userDoc.data().shortName };
            loadMessages();
        }
    } else {
        window.location.href = "auth.html";
    }
});
