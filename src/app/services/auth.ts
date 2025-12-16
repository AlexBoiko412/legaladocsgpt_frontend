export async function logout() {
    await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });
}