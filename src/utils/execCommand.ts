import { spawn } from "child_process";

export async function execCommand(
  command: string,
  args: string[],
  description: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: "inherit",
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${description} process exited with code ${code}`));
      }
    });

    return process;
  });
}
