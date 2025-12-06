export function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.replace("/login");
}
