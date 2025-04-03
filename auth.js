import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

// Регистрация
registerBtn.addEventListener("click", async () => {
    try {
        await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        alert("Регистрация успешна!");
    } catch (error) {
        alert(error.message);
    }
});

// Вход
loginBtn.addEventListener("click", async () => {
    try {
        await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        alert("Вход выполнен!");
    } catch (error) {
        alert(error.message);
    }
});

// Выход
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Выход выполнен!");
    } catch (error) {
        alert(error.message);
    }
});

// Проверка статуса пользователя
onAuthStateChanged(auth, (user) => {
    if (user) {
        emailInput.style.display = "none";
        passwordInput.style.display = "none";
        registerBtn.style.display = "none";
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
    } else {
        emailInput.style.display = "block";
        passwordInput.style.display = "block";
        registerBtn.style.display = "block";
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
    }
});