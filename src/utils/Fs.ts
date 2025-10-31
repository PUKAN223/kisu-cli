// deno-lint-ignore-file no-import-prefix
import { existsSync, ensureDirSync, copySync } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

export function copyFolderRecursive(src: string, dest: string) {
  if (!existsSync(src)) {
    throw new Error(`Source folder does not exist: ${src}`);
  }

  ensureDirSync(dest);

  for (const entry of Deno.readDirSync(src)) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory) {
      copyFolderRecursive(srcPath, destPath);
    } else if (entry.isFile) {
      copySync(srcPath, destPath);
    }
  }
}
