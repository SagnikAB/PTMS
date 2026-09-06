import app from '../server';

export default function handler(req: any, res: any) {
	const requestedPath = req.query?.path;
	if (typeof requestedPath === 'string' && requestedPath.startsWith('/')) {
		req.url = requestedPath.startsWith('/api') ? requestedPath : `/api${requestedPath}`;
	}

	return app(req, res);
}
