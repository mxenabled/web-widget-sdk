function logEvent(event) {
  console.log("event", event)

  const logs = document.querySelector("#logs")
  if (logs) {
    logs.innerHTML = "[event " + time() + "] "
      + JSON.stringify(event, null, "  ") + "\n\n"
      + logs.innerHTML
  }
}

function time() {
  var now = new Date()
  var hour = now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()
  var min = now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()
  var sec = now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds()
  var ms = now.getMilliseconds()
  return hour + ":" + min + ":" + sec + "." + ms
}
