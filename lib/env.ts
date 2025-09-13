export function getServerUrl(): string {
	return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';
}

export function getWebSocketUrl(): string {
	const explicit = process.env.NEXT_PUBLIC_WS_URL;
	if (explicit) return explicit;
	const http = getServerUrl();
	try {
		const u = new URL(http);
		u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
		u.port = u.port ? (u.port === '8080' ? '8081' : u.port) : (u.protocol === 'wss:' ? '' : '8081');
		return u.toString();
	} catch {
		return http.replace(/^http/, 'ws').replace(/:8080(?!\d)/, ':8081');
	}
}

