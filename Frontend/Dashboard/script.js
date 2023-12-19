const btnSendMessage = document.getElementById("btnSendMessage");
btnSendMessage.addEventListener("click", sentMessageToAPI);
const token = localStorage.getItem("userId");

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
