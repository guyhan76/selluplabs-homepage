// Delivery-only resizing: the original PNGs and their pixels remain unchanged.
import sharp from "sharp";
import { mkdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(
  new URL("../public/images/examples/", import.meta.url),
);
const images = JSON.parse(
  await readFile(path.join(root, "provenance.json"), "utf8"),
);
await mkdir(path.join(root, "previews"), { recursive: true });
let originalBytes = 0;
let previewBytes = 0;
for (const image of images) {
  const source = path.join(root, image.file);
  const output = path.join(
    root,
    "previews",
    image.file.replace(/\.png$/, ".webp"),
  );
  await sharp(source)
    .resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(output);
  originalBytes += (await stat(source)).size;
  previewBytes += (await stat(output)).size;
}
console.log(
  `${images.length} previews: ${(previewBytes / 1048576).toFixed(1)} MB (originals: ${(originalBytes / 1048576).toFixed(1)} MB)`,
);
