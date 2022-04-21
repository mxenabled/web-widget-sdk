/* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "config" }] */

const show = (id, obj) => {
  const output = document.querySelector("#output")
  if (!output) {
    throw new Error("#output element was not found")
  }

  const entry = document.createElement("div")
  entry.setAttribute("data-log-id", id)
  entry.textContent = JSON.stringify(obj)
  output.appendChild(entry)
}

const config = {
  widgetContainer: "#widget",
  proxy: "/get-sso-url",
  style: {
    height: "600px",
    width: "400px",
  },
  onConnectedPrimaryAction: (payload) => show("onConnectedPrimaryAction", payload),
  onCreateMemberError: (payload) => show("onCreateMemberError", payload),
  onEnterCredentials: (payload) => show("onEnterCredentials", payload),
  onFocustrap: (payload) => show("onFocustrap", payload),
  onInstitutionSearch: (payload) => show("onInstitutionSearch", payload),
  onLoad: (payload) => show("onLoad", payload),
  onLoaded: (payload) => show("onLoaded", payload),
  onMemberConnected: (payload) => show("onMemberConnected", payload),
  onMemberDeleted: (payload) => show("onMemberDeleted", payload),
  onMemberStatusUpdate: (payload) => show("onMemberStatusUpdate", payload),
  onOauthError: (payload) => show("onOauthError", payload),
  onOauthRequested: (payload) => show("onOauthRequested", payload),
  onPing: (payload) => show("onPing", payload),
  onSelectedInstitution: (payload) => show("onSelectedInstitution", payload),
  onStepChange: (payload) => show("onStepChange", payload),
  onSubmitMFA: (payload) => show("onSubmitMFA", payload),
  onUpdateCredentials: (payload) => show("onUpdateCredentials", payload),
}
