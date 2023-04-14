let registerApi = "http://localhost:8000/register";

//!start register
let registerNameInput = document.querySelector(".form-field input");
console.log(registerNameInput);

async function postRegister() {
  await fetch(registerApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ name: registerNameInput.value }),
  });
}

registerNameInput.addEventListener("change", postRegister);
