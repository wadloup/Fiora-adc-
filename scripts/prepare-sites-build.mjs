import { copyFile, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const publicDirectory = resolve(root, "public");
const clientDirectory = resolve(root, "dist", "client");
const serverDirectory = resolve(root, "dist", "server");
const metadataDirectory = resolve(root, "dist", ".openai");

await mkdir(clientDirectory, { recursive: true });
await mkdir(serverDirectory, { recursive: true });
await mkdir(metadataDirectory, { recursive: true });

const publicEntries = await readdir(publicDirectory, { withFileTypes: true });

await Promise.all(
  publicEntries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      copyFile(
        resolve(publicDirectory, entry.name),
        resolve(clientDirectory, entry.name)
      )
    )
);

await copyFile(
  resolve(root, "sites-worker.js"),
  resolve(serverDirectory, "index.js")
);
await copyFile(
  resolve(root, ".openai", "hosting.json"),
  resolve(metadataDirectory, "hosting.json")
);
