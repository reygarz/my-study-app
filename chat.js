import { auth, db } from "./firebase-config.js";
import { collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const chatContainer = document.getElementById("chatContainer");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessage");
const logoutBtn = document.getElementById("logout");

let currentUser = null;

// Функция для загрузки сообщений в реальном времени
function loadMessages() {
    const messagesQuery = query(collection(db, "chats"), orderBy("timestamp"));

    onSnapshot(messagesQuery, (snapshot) => {
        chatContainer.innerHTML = ""; // Очищаем чат перед загрузкой новых сообщений
        snapshot.forEach((doc) => {
            const message = doc.data();
            const messageElement = document.createElement("p");
            messageElement.textContent = @${message.sender}: ${message.text};
            chatContainer.appendChild(messageElement);
        });
    });
}

// Отправка сообщения
sendMessageBtn.addEventListener("click", async () => {
    const text = messageInput.value.trim();
    if (text === "" || !currentUser) return;

    await addDoc(collection(db, "chats"), {
        sender: currentUser.shortName,
        text: text,
        timestamp: new Date()
    });

    messageInput.value = ""; // Очищаем поле ввода
});

// Выход из аккаунта
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "auth.html"; // Перенаправление на страницу входа
});

// Проверка авторизации пользователя
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            currentUser = userDoc.data();
            loadMessages(); // Загружаем чат
        }
    } else {
        window.location.href = "auth.html"; // Если не авторизован, перенаправляем на вход
    }
});
