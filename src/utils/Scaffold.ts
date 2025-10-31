// deno-lint-ignore-file no-import-prefix
import { copyFolderRecursive } from "../utils/Fs.ts";
import { resolve } from "https://deno.land/std@0.224.0/path/mod.ts";

export function scaffoldProject(projectName: string, templateName: string) {
  const templateDir = resolve("templates", templateName);
  const projectDir = resolve(projectName);

  if (!Deno.statSync(templateDir).isDirectory) {
    throw new Error(`Template "${templateName}" does not exist`);
  }

  try {
    Deno.statSync(projectDir);
    throw new Error(`Project folder "${projectName}" already exists`);
  } catch (_) {
    // Folder does not exist, proceed
  }

  copyFolderRecursive(templateDir, projectDir);
}
