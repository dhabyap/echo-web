// Netlify Function: Proxy to Invidious instance to avoid CORS
// Called as /.netlify/functions/invidious/<endpoint>
// Forwards request to a public Invidious instance and returns JSON response.

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // event.path includes the leading '/invidious' after function name
  const path = event.path.replace(/^\/invidious/, ""); // strip leading '/invidious'
  const query = event.queryStringParameters
    ? `?${new URLSearchParams(event.queryStringParameters).toString()}`
    : "";
  const target = `https://invidious.snopyta.org${path}${query}`;
  try {
    const resp = await fetch(target);
    const data = await resp.text();
    return {
      statusCode: resp.status,
      headers: {
        'Content-Type': resp.headers.get('content-type') || 'application/json',
        // Allow CORS for our site
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
