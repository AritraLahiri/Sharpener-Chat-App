const form = document.getElementById("signupUser");
const formLogIn = document.getElementById("loginUser");

if (form != null) form.addEventListener("submit", signUpUser);
else if (formLogIn != null) formLogIn.addEventListener("submit", logInUser);

function signUpUser(e) {
  e.preventDefault();
  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;
  const phone = document.getElementById("userPhoneNumber").value;
  const userObj = { name, email, password, phone };
  axios
    .post("http://localhost:3000/auth/signup", userObj)
    .then((response) => {
      if (!response) alert("SOMETHING WENT WRONG :(");
      else if (!response.data.success) alert(response.data.message);
      else
        window.location.replace(
          "http://127.0.0.1:5500/Frontend/Auth/login.html"
        );
    })
    .catch((err) => console.log(err));
}
function logInUser(e) {
  e.preventDefault();
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;
  const userObj = { email, password };
  axios
    .post("http://localhost:3000/auth/login", userObj)
    .then((response) => {
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("userId", response.data.token);
        alert("Login Successfull :) ");
        // window.location.replace(
        //   "http://127.0.0.1:5500/Frontend/Expenses/index.html"
        // );
      } else alert(response.data.message);
    })
    .catch((err) => console.log(err));
}
