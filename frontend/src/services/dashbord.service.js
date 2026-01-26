export async function getDashboard() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5300/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}
