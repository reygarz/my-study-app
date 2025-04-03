import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const shortNameInput = document.getElementById("shortName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const usersList = document.getElementById("usersList");

// Функция для проверки уникальности имени
async function isShortNameUnique(shortName) {
    const usersSnapshot = await getDocs(collection(db, "users"));
    for (const userDoc of usersSnapshot.docs) {
        if (userDoc.data().shortName === shortName) {
            return false;
        }
    }
    return true;
}

// Регистрация
registerBtn.addEventListener("click", async () => {
    const shortName = shortNameInput.value.trim();
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!shortName  !email  !password) {
        alert("Заполните все поля!");
        return;
    }

    if (!(await isShortNameUnique(shortName))) {
        alert("Имя уже занято, выберите другое!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        await setDoc(doc(db, "users", userId), {
            shortName: shortName,
            email: email
        });

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

// Получение списка пользователей
async function loadUsers() {
    usersList.innerHTML = "";
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersSnapshot.forEach((doc) => {
        const user = doc.data();
        const li = document.createElement("li");
        li.textContent = @${user.shortName};
        usersList.appendChild(li);
    });
}

// Проверка статуса пользователя
onAuthStateChanged(auth, (user) => {
    if (user) {
        shortNameInput.style.display = "none";
        emailInput.style.display = "none";
        passwordInput.style.display = "none";
        registerBtn.style.display = "none";
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";

        loadUsers(); // Загружаем список пользователей
    } else {
        shortNameInput.style.display = "block";
        emailInput.style.display = "block";
        passwordInput.style.display = "block";
        registerBtn.style.display = "block";
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";

        usersList.innerHTML = ""; // Очищаем список пользователей
    }
});
