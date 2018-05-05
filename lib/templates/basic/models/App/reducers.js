// @flow
type AppState = {
  alertMessage: string,
  alertTitle: string,
  alertDisplayed: boolean,
  alertType: "warning" | "error" | "info"
}

const INITIAL_STATE: AppState = {
  alertMessage: "",
  alertTitle: "",
  alertDisplayed: false,
  alertType: "info"
}

export function app (state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case 'app/alert/show':
      return {
        ...state,
        alertDisplayed: true,
        ...payload
      }
    case 'app/alert/hide':
      return {
        ...state,
        alertDisplayed: false
      }
    default:
      return state
  }
}
