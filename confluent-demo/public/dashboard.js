
document.querySelector("#address").innerText = DEMO_SHORT_URL;
const messagesArea = document.querySelector("#messages");

// Websocket stuff
socket = new WebSocket(WS_SERVER);
socket.addEventListener('open', (e) => {console.log("Connection opened", e); return false;});
socket.addEventListener('close', (e) => {console.log("Connection closed", e); return false;});
socket.addEventListener('message', async event => {
  event.preventDefault();
  let msg;
  if (event.data.text) {
    msg = await event.data.text();
  } else {
    msg = event.data;
  }
  msg = JSON.parse(msg);
  let column = msg.type;
  let message = msg.message;
  let color = msg.color;
  let td = document.querySelector(`#${column}`);
  let newEl = document.createElement("div");
  newEl.innerText = message;
  newEl.classList.add("event-box");
  if (color) newEl.setAttribute("style", `background-color: ${color}`)
  td.append(newEl);
  td.classList.add("fadeIn");
  setTimeout(() => td.classList.add("fadeOut"), EVENT_BOX_DURATION-2000);
  setTimeout(() => td.removeChild(newEl), EVENT_BOX_DURATION);
  messagesArea.value += JSON.stringify(msg);
  return false;
});

// Version numbering
document.querySelector("#version").innerText=`v${VERSION}`;