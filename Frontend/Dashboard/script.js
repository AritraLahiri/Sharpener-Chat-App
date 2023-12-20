const btnSendMessage = document.getElementById("btnSendMessage");
const divMessage = document.getElementById("chat_div");
const divUser = document.getElementById("user_div");
const divSend = document.getElementById("div_send");
btnSendMessage.addEventListener("click", sentMessageToAPI);
const token = localStorage.getItem("userId");
const receiverId = localStorage.getItem("receiverId");
getAllUsersFromAPI();

// setInterval(getMessagesFromAPI, 1000);

function sentMessageToAPI() {
  const message = document.getElementById("message");
  if (message != null && token != null) {
    const msgObj = {
      message: message.value,
      from: token,
      to: localStorage.getItem("receiverId"),
    };
    axios
      .post("http://localhost:3000/message/send", msgObj, {
        headers: { Authorization: token },
      })
      .then((response) => {
        document.getElementById("message").value = "";
        console.log(response);
        if (response.data.success) {
          alert("message sent successfully");
        } else alert(response.data.message);
      })
      .catch((err) => console.log(err));
  }
}

function getMessagesFromAPI() {
  console.log(token);
  console.log(receiverId);
  axios
    .get(`http://localhost:3000/message/receive/${receiverId}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        divMessage.innerHTML = "";
        for (let data of response.data.data) {
          console.log(data.message);
          let message = data.message;
          let userName = data.user.name;
          let p = document.createElement("p");
          p.classList.add("messageGroup");
          p.appendChild(document.createTextNode(`${userName} : ${message}`));
          divMessage.appendChild(p);
        }
      }
    })
    .catch((err) => console.log(err));
}

function getAllUsersFromAPI() {
  axios
    .get("http://localhost:3000/auth/users", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        divUser.innerHTML = "";
        for (let data of response.data.data) {
          let userName = data.name;
          let userEmail = data.email;
          let button = document.createElement("button");
          button.classList.add("userGroup");
          button.classList.add("list-group-item");
          button.classList.add("messageGroup");
          button.appendChild(
            document.createTextNode(`${userName} : ${userEmail}`)
          );
          button.addEventListener("click", () => {
            localStorage.setItem("receiverId", data.id);
            document.getElementById("usr_lst").classList.toggle("d-none");
            divSend.classList.toggle("d-none");
            divMessage.classList.toggle("d-none");
            //getMessagesFromAPI();
            setInterval(getMessagesFromAPI, 1000);
          });
          divUser.appendChild(button);
        }
      }
    })
    .catch((err) => console.log(err));
}
