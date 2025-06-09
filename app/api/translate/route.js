import { translate as gt } from '@vitalets/google-translate-api';
import { HttpProxyAgent } from 'http-proxy-agent';

const proxies = [
    'http://91.103.120.57:80',
    'http://82.102.10.253:80',
    'http://91.103.120.48:80',
    'http://65.108.203.37:18080',
    'http://209.135.168.41:80',
    'http://91.103.120.37:80',
    'http://91.103.120.40:80',
    'http://81.169.213.169:8888',
    'http://77.237.76.83:80',
];

function shuffleProxies(list) {
    return list.sort(() => Math.random() - 0.5);
}

async function translateWithProxy(text, to = 'ar') {
  const shuffled = shuffleProxies(proxies);

  for (const proxy of shuffled) {
    try {
      const agent = new HttpProxyAgent(proxy);
      const result = await gt(text, {
        to,
        fetchOptions: { agent },
      });
      return result.text;
    } catch (e) {
      console.warn(`Proxy failed (${proxy}): ${e.message}`);
    }
  }

  // Fallback to direct translation without proxy
  console.warn('All proxies failed. Attempting direct translation...');
  try {
    const result = await gt(text, { to });
    return result.text;
  } catch (e) {
    console.error('Direct translation also failed:', e);
    throw new Error('Translation failed');
  }
}

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text || !text.trim()) {
            return new Response(JSON.stringify({ error: 'Text is required' }), { status: 400 });
        }

        const translatedText = await translateWithProxy(text);

        return new Response(JSON.stringify({ translated: translatedText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Translate error:', error);
        return new Response(JSON.stringify({ error: 'Translation failed' }), { status: 500 });
    }
}