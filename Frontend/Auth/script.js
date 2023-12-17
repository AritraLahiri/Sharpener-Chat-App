const form = document.getElementById("signupUser");

form.addEventListener("submit", signUpUser);

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
      else alert("Account Creation successfull :) ");

      // window.location.replace(
      //   "http://127.0.0.1:5500/Frontend/Auth/index.html"
      // );
    })
    .catch((err) => console.log(err));
}
// function logInUser(e) {
//   e.preventDefault();
//   const email = document.getElementById("userLogInEmail").value;
//   const password = document.getElementById("userLogInPassword").value;
//   const userObj = { email, password };
//   axios
//     .post("http://localhost:3000/user/login", userObj)
//     .then((response) => {
//       if (response.data.success) {
//         localStorage.setItem("userId", response.data.token);
//         localStorage.setItem("isPremiumUser", response.data.isPremiumUser);
//         window.location.replace(
//           "http://127.0.0.1:5500/Frontend/Expenses/index.html"
//         );
//       } else alert("Login Failed !");
//     })
//     .catch((err) => console.log(err));
// }
