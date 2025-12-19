export async function fetchFlashMessageContent() {
  const response = await fetch("/api/flash-message");
  if (!response.ok) {
    throw new Error("Failed to fetch flash message content");
  }
  return await response.json();
}
