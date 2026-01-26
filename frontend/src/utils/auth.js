export function isAdmin() {
  return localStorage.getItem("role") === "admin";
}

export function getToken() {
  return localStorage.getItem("token");
}
