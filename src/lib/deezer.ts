/**
 * Deezer API helper — thin fetch wrapper with error handling.
 * Base URL: https://api.deezer.com
 * No auth required. CORS is open from browsers.
 */

const BASE = "https://api.deezer.com";

export class DeezerApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "DeezerApiError";
  }
}

export async function fetchDeezer<T>(endpoint: string): Promise<T> {
  const url = `${BASE}${endpoint}`;
  let res: Response;

  try {
    res = await fetch(url);
  } catch (err) {
    throw new DeezerApiError(
      `Network error fetching ${url}: ${err instanceof Error ? err.message : err}`,
    );
  }

  if (res.status === 429) {
    throw new DeezerApiError("Deezer rate limit exceeded (429)", 429);
  }

  if (!res.ok) {
    throw new DeezerApiError(
      `Deezer API error ${res.status} for ${endpoint}`,
      res.status,
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new DeezerApiError(`Malformed JSON from ${endpoint}`);
  }

  return json as T;
}
