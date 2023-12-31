const btnChat = document.getElementById("btnChat");
const btnInvite = document.getElementById("btnInvite");
const btnRequests = document.getElementById("btnRequests");
const btnMembers = document.getElementById("btnMembers");
const btnCreateGroup = document.getElementById("btnCreateGroup");
const token = localStorage.getItem("userId");
const divGroup = document.getElementById("group_div");
const divInviteUsers = document.getElementById("friend_div");
const divMembers = document.getElementById("member_div");
const divInviteRequest = document.getElementById("friend_req_div");
const divSend = document.getElementById("div_send");
const btnSendMessage = document.getElementById("btnSendMessage");
const divMessage = document.getElementById("chat_div");
let isAdmin = false;

getAllGroupsFromAPI();
getAllUsersFromAPI();
getAllPendingRequestFromAPI();
isUserAdmin();

btnMembers.addEventListener("click", getAllMembersFromAPI);
btnSendMessage.addEventListener("click", sentGroupMessageToAPI);

btnChat.addEventListener("click", () => {
  window.location.replace(
    "http://127.0.0.1:5500/Frontend/Dashboard/index.html"
  );
});
btnCreateGroup.addEventListener("click", () => {
  const groupName = document.getElementById("groupName").value;
  const groupObj = { groupName };
  axios
    .post("http://localhost:3000/group/createGroup", groupObj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      if (response.data.success) {
        alert(response.data.message);
      }
      getAllGroupsFromAPI();
    })
    .catch((err) => console.log(err));
});

function sentGroupMessageToAPI() {
  const message = document.getElementById("message");
  if (message != null && token != null) {
    const msgObj = {
      message: message.value,
    };
    axios
      .post(
        `http://localhost:3000/group/send/${localStorage.getItem("groupId")}`,
        msgObj,
        {
          headers: { Authorization: token },
        }
      )
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
  axios
    .get(
      `http://localhost:3000/group/receive/${localStorage.getItem("groupId")}`,
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        divMessage.innerHTML = "";
        for (let data of response.data.data) {
          messageBodyHTML(data);
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

function getAllGroupsFromAPI() {
  axios
    .get("http://localhost:3000/group/all", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      if (!response.data.success) {
        console.log(response);
        alert(response.data.message);
      } else {
        divGroup.innerHTML = "";
        console.log(response.data);
        for (let data of response.data.data) {
          let userName = data.group.name;
          let button = document.createElement("button");
          button.classList.add("userGroup");
          button.classList.add("list-group-item");
          button.classList.add("messageGroup");
          button.appendChild(document.createTextNode(`${userName}`));
          button.addEventListener("click", () => {
            localStorage.setItem("groupId", data.groupId);
            document.getElementById("grp_lst").classList.toggle("d-none");
            divSend.classList.toggle("d-none");
            divMessage.classList.toggle("d-none");
            btnRequests.classList.toggle("d-none");
            btnInvite.classList.toggle("d-none");
            btnMembers.classList.toggle("d-none");
            getMessagesFromAPI();
            setInterval(getMessagesFromAPI, 1000);
          });
          divGroup.appendChild(button);
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
        divInviteUsers.innerHTML = "";
        for (let data of response.data.data) {
          let userName = data.name;
          let userEmail = data.email;
          let li = document.createElement("li");
          let button = document.createElement("button");
          const msgObj = {};
          li.classList.add("list-group-item");
          button.classList.add("btn");
          button.classList.add("btn-success");
          button.classList.add("btn-sm");
          li.appendChild(document.createTextNode(`${userName} : ${userEmail}`));

          button.appendChild(document.createTextNode(`Invite`));
          button.addEventListener("click", (e) => {
            e.preventDefault();
            axios
              .post(
                `http://localhost:3000/invite/${data.id}/${localStorage.getItem(
                  "groupId"
                )}`,
                msgObj,
                {
                  headers: { Authorization: token },
                }
              )
              .then((response) => {
                if (response.data.success) {
                  alert("Invite sent successfully");
                } else {
                  alert("error");
                  console.log(response.data);
                }
              })
              .catch((err) => console.log(err));
          });
          li.appendChild(button);
          divInviteUsers.appendChild(li);
        }
      }
    })
    .catch((err) => console.log(err));
}

function getAllPendingRequestFromAPI() {
  axios
    .get("http://localhost:3000/invite/all", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        divInviteRequest.innerHTML = "";
        for (let data of response.data.data) {
          //   let userName = data.user.name;
          let groupName = data.group.name;
          let li = document.createElement("li");
          let button = document.createElement("button");
          const payload = { groupId: data.groupId };
          li.classList.add("list-group-item");
          button.classList.add("btn");
          button.classList.add("btn-success");
          button.classList.add("btn-sm");
          li.appendChild(
            document.createTextNode(`Invitation to join ${groupName}`)
          );
          button.appendChild(document.createTextNode(`Join`));
          button.addEventListener("click", (e) => {
            e.preventDefault();
            axios
              .post(`http://localhost:3000/invite/joinGroup`, payload, {
                headers: { Authorization: token },
              })
              .then((response) => {
                if (response.data.success) {
                  alert("Group joined successfully");
                } else {
                  alert("error");
                  console.log(response.data);
                }
              })
              .catch((err) => console.log(err));
          });
          li.appendChild(button);
          divInviteRequest.appendChild(li);
        }
      }
    })
    .catch((err) => console.log(err));
}

function getAllMembersFromAPI() {
  axios
    .get(
      `http://localhost:3000/group/member/${localStorage.getItem("groupId")}`,
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        console.log(response.data);
        divMembers.innerHTML = "";
        for (let data of response.data.data) {
          let userName = data.user.name;
          let userEmail = data.user.email;
          let li = document.createElement("li");
          li.classList.add("list-group-item");
          li.appendChild(document.createTextNode(`${userName} : ${userEmail}`));
          if (isAdmin) {
            let button = document.createElement("button");
            button.classList.add("btn");
            button.classList.add("btn-sm");
            button.classList.add("btn-danger");
            button.appendChild(document.createTextNode("Remove"));
            button.addEventListener("click", () => {
              axios
                .post(
                  `http://localhost:3000/group/leave/${localStorage.getItem(
                    "groupId"
                  )}`,
                  {},
                  {
                    headers: { Authorization: token },
                  }
                )
                .then((response) => {
                  console.log(response);
                  if (response.data.success) {
                    //getAllMembersFromAPI();
                  }
                })
                .catch((e) => alert("SOMETHING WENT WRONG"));
            });
            li.appendChild(button);
          }
          divMembers.appendChild(li);
        }
      }
    })
    .catch((err) => console.log(err));
}

function isUserAdmin() {
  const msgObj = {};
  axios
    .post(
      `http://localhost:3000/group/isAdmin/${localStorage.getItem("groupId")}`,
      msgObj,
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      if (response.data.success) {
        isAdmin = response.data.isAdmin;
      }
    })
    .catch((err) => console.log(err));
}
