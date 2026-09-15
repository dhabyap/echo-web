// Netlify Function: Proxy to Invidious instance to avoid CORS
// Called as /.netlify/functions/invidious/<endpoint>
// Forwards request to a public Invidious instance and returns JSON response.

const fetch = (...args) => globalThis.fetch(...args);

exports.handler = async function(event, context) {
  const basePath = '/.netlify/functions/invidious';
  let path = event.path;
  if (path.startsWith(basePath)) {
    path = path.slice(basePath.length);
  }
  const query = event.queryStringParameters
    ? `?${new URLSearchParams(event.queryStringParameters).toString()}`
    : '';
  const target = `https://invidious.snopyta.org${path}${query}`;
  try {
    const resp = await fetch(target);
    // If Invidious returns an error (e.g., 5xx), treat as empty response to avoid breaking the app
    if (!resp.ok) {
      console.error('Invidious error', resp.status, resp.statusText);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: `Invidious error ${resp.status}` }),
      };
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
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
