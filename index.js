import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.getElementById("checkFirebase").addEventListener("click", async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "test"));
        alert("Firebase подключен!");
    } catch (error) {
        alert("Ошибка Firebase: " + error.message);
    }
});