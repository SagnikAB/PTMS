import app from '../server';

export default function handler(req: any, res: any) {
  try {
    // In Vercel serverless functions, req.originalUrl contains the full client-requested path with query parameters
    if (req.originalUrl && req.originalUrl.startsWith('/api')) {
      req.url = req.originalUrl;
    } else if (typeof req.query?.path === 'string') {
      const p = req.query.path.startsWith('/') ? req.query.path : `/${req.query.path}`;
      req.url = p.startsWith('/api') ? p : `/api${p}`;
    } else if (!req.url.startsWith('/api')) {
      req.url = `/api${req.url}`;
    }
  } catch (e) {
    console.error('URL normalization error:', e);
  }

  return app(req, res);
}

