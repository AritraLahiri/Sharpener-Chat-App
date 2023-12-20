const btnSendMessage = document.getElementById("btnSendMessage");
const divMessage = document.getElementById("chat_div");
btnSendMessage.addEventListener("click", sentMessageToAPI);
const token = localStorage.getItem("userId");
getMessagesFromAPI();

function sentMessageToAPI() {
  const message = document.getElementById("message");
  if (message != null && token != null) {
    const msgObj = {
      message: message.value,
      from: localStorage.getItem("userId"),
    };
    axios
      .post("http://localhost:3000/message/send", msgObj, {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          alert("message sent successfully");
        } else alert(response.data.message);
      })
      .catch((err) => console.log(err));
  }
}

function getMessagesFromAPI() {
  axios
    .get("http://localhost:3000/message/receive", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      if (!response.data.success) {
        alert(response.data.message);
      } else {
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
