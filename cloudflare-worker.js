// Cloudflare Worker — PlayHQ CORS proxy
// Deployment steps:
//   1. Go to https://dash.cloudflare.com  (free account, no credit card needed)
//   2. Left sidebar → Workers & Pages → Create → Create Worker
//   3. Replace all the default code with this file's contents
//   4. Click "Deploy"
//   5. Copy the worker URL shown (e.g. https://afl-proxy.yourname.workers.dev)
//   6. Paste that URL into index.html where it says REPLACE_WITH_YOUR_WORKER_URL

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const body = await request.text();

    const upstream = await fetch('https://api.playhq.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'tenant': 'afl',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Origin': 'https://www.playhq.com',
        'Referer': 'https://www.playhq.com/',
      },
      body,
    });

    const data = await upstream.text();

    return new Response(data, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
