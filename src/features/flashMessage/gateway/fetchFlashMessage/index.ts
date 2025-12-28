export async function fetchFlashMessage() {
  const response = await fetch("/api/flashMessageContent");
  if (!response.ok) {
    throw new Error("Failed to fetch flash message content");
  }
  return await response.json();
}
