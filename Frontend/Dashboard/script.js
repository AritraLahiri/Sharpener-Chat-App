var options = {
  rememberUpgrade: true,
  transports: ["websocket"],
  secure: true,
  rejectUnauthorized: false,
};
const btnSendMessage = document.getElementById("btnSendMessage");
let newMessageCount = 0;
const divMessage = document.getElementById("chat_div");
const divUser = document.getElementById("user_div");
const divSend = document.getElementById("div_send");
const btnGroup = document.getElementById("btnGroup");
btnSendMessage.addEventListener("click", sentMessageToAPI);
const token = localStorage.getItem("userId");
const receiverId = localStorage.getItem("receiverId");
let lastMessageId =
  localStorage.getItem("messageData") != null
    ? JSON.parse(localStorage.getItem("messageData")).length - 1
    : -1;
getAllUsersFromAPI();

btnGroup.addEventListener("click", () => {
  window.location.replace("http://127.0.0.1:5500/Frontend/Group/index.html");
});

function sentMessageToAPI() {
  const message = document.getElementById("message");
  var socket = io.connect("http://localhost:3000", options);

  if (message != null && token != null) {
    const msgObj = {
      message: message.value,
      from: token,
      to: localStorage.getItem("receiverId"),
    };
    socket.emit("message", {
      to: localStorage.getItem("receiverId"),
      message: message.value,
      userId: token,
    });
    document.getElementById("message").value = "";
    alert("Message Sent");
  }
}

function getMessagesFromAPI() {
  options.query = { to: localStorage.getItem("receiverId"), userId: token };
  var socket = io.connect("http://localhost:3000", options);
  socket.on("message", (response) => {
    const msgObjArr = response;
    if (msgObjArr != null && newMessageCount < msgObjArr.length) {
      divMessage.innerHTML = "";
      newMessageCount = msgObjArr.length;
      for (let data of msgObjArr) {
        messageBodyHTML(data);
      }
    }
  });
}

function messageBodyHTML(data) {
  console.log(data);
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
