const btnSendMessage = document.getElementById("btnSendMessage");
const divMessage = document.getElementById("chat_div");
const divUser = document.getElementById("user_div");
const divSend = document.getElementById("div_send");
btnSendMessage.addEventListener("click", sentMessageToAPI);
const token = localStorage.getItem("userId");
const receiverId = localStorage.getItem("receiverId");
let lastMessageId =
  localStorage.getItem("messageData") != null
    ? JSON.parse(localStorage.getItem("messageData")).length - 1
    : -1;
getAllUsersFromAPI();

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
  divMessage.innerHTML = "";
  if (localStorage.getItem("messageData") != undefined) {
    const msgObjArr = JSON.parse(localStorage.getItem("messageData"));
    for (let data of msgObjArr) {
      messageBodyHTML(data);
    }
  }

  axios
    .get(
      `http://localhost:3000/message/receive/${receiverId}/${lastMessageId}`,
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        if (response.data.data.length > 0) {
          let arr =
            localStorage.getItem("messageData") != null
              ? JSON.parse(localStorage.getItem("messageData"))
              : [];
          arr = arr.concat(response.data.data);
          localStorage.setItem("messageData", JSON.stringify(arr));
        }
        for (let data of response.data.data) {
          lastMessageId = data.id;
        }
      }
    })
    .catch((err) => console.log(err));
}

function messageBodyHTML(data) {
  let message = data.message;
  let userName = data.user.name;
  let p = document.createElement("p");
  p.classList.add("messageGroup");
  p.appendChild(document.createTextNode(`${userName} : ${message}`));
  divMessage.appendChild(p);
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
            // getMessagesFromAPI();
            setInterval(getMessagesFromAPI, 1000);
          });
          divUser.appendChild(button);
        }
      }
    })
    .catch((err) => console.log(err));
}
