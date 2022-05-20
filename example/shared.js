/* global Prism */
/* eslint @typescript-eslint/no-unused-vars: "off" */

/**
 * @param {Object | String} event
 */
function logEvent(event) {
  console.log("Post Message Event", event)

  const logs = document.querySelector("#logs")
  if (!logs) {
    console.error("Unable to find #logs element")
    return
  }

  const line = document.createElement("span")
  line.className = "line"

  const label = document.createElement("span")
  label.className = "label"
  label.textContent = "[ " + humanFriendlyTime() + " ]"

  const contents = document.createElement("span")
  contents.className = "contents"
  contents.innerHTML = event instanceof Object ? highlightJSON(event) : event

  line.appendChild(label)
  line.appendChild(contents)
  logs.prepend(line)
}

/**
 * @return {String}
 */
function humanFriendlyTime() {
  const now = new Date()
  const hour = now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()
  const min = now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()
  const sec = now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds()
  const ms = now.getMilliseconds()
  return hour + ":" + min + ":" + sec + "." + ms
}

/**
 * Highlights (if Prism has been loaded) and pretty-formats a JSON object.
 *
 * @param {Object} obj
 * @return {String}
 */
function highlightJSON(obj) {
  const str = JSON.stringify(obj, null, "  ")
  if (!window.Prism) {
    return str
  }

  return Prism.highlight(str, Prism.languages.javascript, "javascript")
}
