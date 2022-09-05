export const setOption = (key, value) => {
    localStorage.setItem(key, value);
}
export const getOption = (key) => {
  return localStorage.getItem(key);
}