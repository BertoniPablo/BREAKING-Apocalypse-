// loginSystem.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function showMessage(msg, color = "red") {
  const msgEl = document.getElementById("message");
  msgEl.innerText = msg;
  msgEl.style.color = color;
}

document.getElementById("login-button").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      startGame();
    })
    .catch((error) => {
      showMessage("Inicio de sesión incorrecto: " + error.message);
    });
});

document.getElementById("register-button").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (email === "" || password === "") {
    showMessage("Complete todos los campos.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      showMessage("¡Registro exitoso! Ahora puedes iniciar sesión.", "green");
    })
    .catch((error) => {
      showMessage("Error de registro: " + error.message);
    });
});

function startGame() {
  const user = auth.currentUser;
  if (user) {
    localStorage.setItem("userEmail", user.email);
  }

  document.getElementById("login-container").style.display = "none";
  document.getElementById("app").style.display = "block";

  const script = document.createElement("script");
  script.type = "module";
  script.src = "/src/main.js";
  document.body.appendChild(script);
}
