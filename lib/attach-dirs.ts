import { isAbsolute, join, resolve, sep } from "node:path";

/**
 * Parse WHATSAPP_ATTACH_DIRS: a ":"-separated list of directories that
 * outbound attachments may come from. A leading "~" is the home directory.
 * Relative entries are dropped rather than resolved against whatever the
 * server's CWD happens to be, so the list means the same thing however the
 * server was launched. Unset or empty (after dropping bad entries) returns
 * [], which keeps the default behaviour: no directory allowlist.
 */
export function parseAttachDirs(
  raw: string | undefined,
  home: string,
): string[] {
  if (!raw) return [];
  const dirs: string[] = [];
  for (const part of raw.split(":")) {
    const entry = part.trim();
    if (!entry) continue;
    const expanded =
      entry === "~"
        ? home
        : entry.startsWith("~/")
          ? join(home, entry.slice(2))
          : entry;
    if (!isAbsolute(expanded)) continue;
    dirs.push(resolve(expanded));
  }
  return dirs;
}

/**
 * True when `real` (an already-resolved path) is strictly inside one of
 * `dirs` (also resolved). A directory itself is not "inside" itself, and
 * "/a/bc" is not inside "/a/b".
 */
export function isInsideAny(real: string, dirs: string[]): boolean {
  return dirs.some((dir) =>
    real.startsWith(dir.endsWith(sep) ? dir : dir + sep),
  );
}
