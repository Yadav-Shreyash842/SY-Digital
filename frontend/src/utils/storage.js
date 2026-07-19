export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

export const getItem = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (e) {}
}
