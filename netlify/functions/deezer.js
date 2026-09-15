exports.handler = async function(event, context) {
  const path = event.path.replace(/^\/\.netlify\/functions\/deezer/, '');
  const query = event.queryStringParameters ? new URLSearchParams(event.queryStringParameters).toString() : '';
  const target = `https://api.deezer.com${path}${query ? '?' + query : ''}`;
  const response = await fetch(target);
  const data = await response.text();
  const isJson = response.headers.get('content-type')?.includes('application/json');
  return {
    statusCode: response.status,
    body: isJson ? data : JSON.stringify({ raw: data }),
    headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
  };
};
