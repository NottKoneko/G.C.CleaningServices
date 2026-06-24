export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    
    // Parse request JSON body
    const body = await request.json();

    // 1. Extract Turnstile token and client IP
    const token = body['cf-turnstile-response'];
    const ip = request.headers.get('CF-Connecting-IP');

    if (!token) {
      return new Response(JSON.stringify({ success: false, message: 'Missing Turnstile verification token.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Verify with Cloudflare Turnstile API
    const siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const siteverifyResponse = await fetch(siteverifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(token)}&remoteip=${encodeURIComponent(ip)}`
    });

    const siteverifyResult = await siteverifyResponse.json();
    if (!siteverifyResult.success) {
      return new Response(JSON.stringify({ success: false, message: 'Turnstile verification failed.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Remove Turnstile token, attach Web3Forms key, and forward to Web3Forms
    delete body['cf-turnstile-response'];
    
    // Use env variable or fallback to the client's current key if env not configured yet
    body.access_key = env.WEB3FORMS_ACCESS_KEY || 'ca5b6c26-3482-43e5-b261-2ae13c55615d';

    const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const web3formsData = await web3formsResponse.json();
    
    return new Response(JSON.stringify(web3formsData), {
      status: web3formsResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
