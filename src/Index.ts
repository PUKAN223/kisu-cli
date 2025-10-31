import chalk from "jsr:@nothing628/chalk";
import { Logger } from "./utils/Logger.ts";
import { resolve } from "node:path";

async function runCLI() {
  const logger = new Logger();
  const templateGit = "https://github.com/PUKAN223/kisu-cli-template";

  const projectName = await logger.prompt("Project name");
  if (projectName === "") {
    console.clear();
    return;
  }
  const projectPath = "./" + projectName;
  const projectDir = resolve(projectPath);
  logger.info(`Cloning template from ${templateGit} into ${projectDir}...`);

  const cloneCommand = new Deno.Command("git", {
    args: ["clone", "--progress", templateGit, projectDir],
    stdout: "piped",
    stderr: "piped",
  });

  const process = cloneCommand.spawn();

  const decoder = new TextDecoder();
  const reader = process.stderr.getReader();

  function renderProgressBar(percentage: number) {
    const total = 20;
    const filled = Math.floor((percentage / 100) * total);
    const empty = total - filled;
    const label = chalk.bgHex("#eeff02ff")(" PROGRESS ");
    Deno.stdout.writeSync(
      new TextEncoder().encode(
        `\r${label} [${"=".repeat(filled)}${" ".repeat(empty)}] ${
          percentage.toFixed(0)
        }%`,
      ),
    );
  }

  await (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      // Git progress line looks like: "Receiving objects:  42% (123/456)"
      const match = text.match(/(\d+)%/);
      if (match) {
        renderProgressBar(Number(match[1]));
      }
    }
  })();

  console.log("");
  logger.success(
    `Project "${projectName}" created successfully!\n${" ".repeat(11)}You can now:\n${" ".repeat(15)}- cd ./${projectName}\n${" ".repeat(15)}- deno run dev`,
  );
}

export { runCLI };
