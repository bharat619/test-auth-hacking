import path from "path";

export function getDataDir(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "notes-crud-data");
  }
  return path.join(process.cwd(), "data");
}
