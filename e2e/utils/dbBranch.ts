export async function createDbBranch() {
  const response = await fetch(
    `https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEON_API_TOKEN}`,
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: {
          name: `test-${process.pid}-${new Date().toISOString()}`,
          parent_id: process.env.NEON_TEST_BASE_BRANCH_ID,
        },
        endpoints: [
          {
            type: "read_write",
          },
        ],
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to create branch: ${response.statusText}`);
  }
  return await response.json();
}

export async function deleteDbBranch(branchId: string) {
  try {
    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${branchId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEON_API_TOKEN}`,
          accept: "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to delete branch: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting branch:", error);
  }
}
