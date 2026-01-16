import { atom } from "recoil"

export const setUserData = (data) => {
  localStorage.setItem("user", JSON.stringify(data))
}
export const getUserData = () => {
  try {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error("Failed to parse user data", e);
    return null;
  }
}
export const clearUser = () => {
  localStorage.removeItem("user");
}
const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
  } catch (e) {
    console.error("Failed to parse user", e);
  }
  return null;
}
export const toggleState = atom({
  key: "toggle",
  default: { subscripPgTgl: false, notify: false }
})

export const userData = atom({
  key: 'userData',
  default: { user: getUser() }
})

export const notificationState = atom({
  key: 'notifications',
  default: []
})

export const themeState = atom({
  key: 'themeState',
  default: localStorage.getItem('theme') || 'Light'
})
