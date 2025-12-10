import router from "../routes/Routes";

export function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  router.push("/login")
}