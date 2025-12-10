export interface URLMapping {
  pathPrefix: string;
  repoPrefix: string;
}

/**
 * Parse URL mappings from environment variable
 * Format: "libs/:go-lib-:/utils:go-util-"
 * Note: pathPrefix should not include leading slash, trailing slash is optional
 */
export function parseURLMappings(mappingsStr: string): URLMapping[] {
  if (!mappingsStr || mappingsStr.trim() === '') {
    return [];
  }

  const parts = mappingsStr.split(':');
  const mappings: URLMapping[] = [];

  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      // Remove trailing slash from pathPrefix if present
      let pathPrefix = parts[i];
      if (pathPrefix.endsWith('/')) {
        pathPrefix = pathPrefix.slice(0, -1);
      }

      mappings.push({
        pathPrefix,
        repoPrefix: parts[i + 1],
      });
    }
  }

  return mappings;
}

/**
 * Apply URL mappings to transform path to repo name
 * Example: "/libs/checksum" with mapping "libs:go-lib-" -> "go-lib-checksum"
 */
export function applyURLMappings(path: string, mappings: URLMapping[]): string {
  // Remove leading slash from path for comparison
  const pathWithoutSlash = path.startsWith('/') ? path.substring(1) : path;

  for (const mapping of mappings) {
    if (pathWithoutSlash.startsWith(mapping.pathPrefix + '/')) {
      // Replace the path prefix (including the slash) with repo prefix
      const remainder = pathWithoutSlash.substring(mapping.pathPrefix.length + 1);
      return mapping.repoPrefix + remainder;
    }
  }

  // No mapping found, return path as-is (without leading slash)
  return pathWithoutSlash;
}
