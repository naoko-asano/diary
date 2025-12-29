export async function fetchFlashMessage() {
  const response = await fetch("/api/flashMessage");
  if (!response.ok) {
    throw new Error("Failed to fetch flash message");
  }
  return await response.json();
}
