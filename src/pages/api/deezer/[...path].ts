import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query as { path?: string | string[] };
  const deezerPath = Array.isArray(path) ? path.join('/') : (path ?? '');
  const originalUrl = req.url ?? '';
  const queryIdx = originalUrl.indexOf('?');
  const query = queryIdx !== -1 ? originalUrl.substring(queryIdx) : '';
  const target = `https://api.deezer.com/${deezerPath}${query}`;
  try {
    const response = await fetch(target);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Proxy error', details: e instanceof Error ? e.message : String(e) });
  }
}
