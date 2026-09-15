// Netlify Function: Proxy to Invidious instance to avoid CORS
// Called as /.netlify/functions/invidious/<endpoint>
// Forwards request to a public Invidious instance and returns JSON response.

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Netlify passes full request path, e.g. '/.netlify/functions/invidious/api/v1/videos/mt1'
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
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
