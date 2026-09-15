// Netlify Function: Proxy to Invidious instance to avoid CORS
// Called as /.netlify/functions/invidious/<endpoint>
// Forwards request to a public Invidious instance and returns JSON response.

const INVIDIOUS_INSTANCES = [
  'https://invidious.snopyta.org',
  'https://invidious.kavin.rocks',
  'https://invidious.fdn.vn',
];

exports.handler = async function(event, context) {
  const basePath = '/.netlify/functions/invidious';
  let path = event.path;
  if (path.startsWith(basePath)) {
    path = path.slice(basePath.length);
  }
  const query = event.queryStringParameters
    ? `?${new URLSearchParams(event.queryStringParameters).toString()}`
    : '';
  // Try each Invidious instance until one succeeds
  for (const instance of INVIDIOUS_INSTANCES) {
    const target = `${instance}${path}${query}`;
    try {
      const resp = await fetch(target);
      if (!resp.ok) {
        console.error('Invidious error', instance, resp.status);
        continue; // try next instance
      }
      const data = await resp.text();
      return {
        statusCode: resp.status,
        headers: {
          'Content-Type': resp.headers.get('content-type') || 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: data,
      };
    } catch (err) {
      console.error('Fetch failed for', instance, err.message);
      // continue to next instance
    }
  }
  // All instances failed
  return {
    statusCode: 503,
  };
};
