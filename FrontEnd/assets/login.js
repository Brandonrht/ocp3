const baseApiUrl = "http://localhost:5678/api/";

function handleSubmit(event) {
  event.preventDefault();

  const form = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
  };

  loginUser(form);
}

function loginUser(form) {
  fetch(`${baseApiUrl}users/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    }),
  })
    .then(handleResponse)
    .catch((error) => {
      console.error("Error during fetch:", error);
      alert("An error occurred. Please try again.");
    });
}

function handleResponse(response) {
  if (response.status !== 200) {
    alert("Email ou mot de passe erronés");
  } else {
    response.json().then((data) => {
      sessionStorage.setItem("SB_token", data.token); // STORE TOKEN
      window.location.replace("index.html");
    });
  }
}

document.addEventListener("submit", handleSubmit);

