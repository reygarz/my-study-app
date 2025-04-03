import { auth, db } from "../firebase/firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Вход
if (document.getElementById("loginBtn")) {
    document.getElementById("loginBtn").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "chat.html";
        } catch (error) {
            alert("Ошибка входа: " + error.message);
        }
    });
}

// Регистрация
if (document.getElementById("registerBtn")) {
    document.getElementById("registerBtn").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const shortName = document.getElementById("shortName").value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), { shortName });
            window.location.href = "chat.html";
        } catch (error) {
            alert("Ошибка регистрации: " + error.message);
        }
    });
}