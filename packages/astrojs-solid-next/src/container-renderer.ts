import type { AstroRenderer } from 'astro';

export function getContainerRenderer(): AstroRenderer {
	return {
		name: '@solidiom/astrojs-solid-next',
		clientEntrypoint: '@solidiom/astrojs-solid-next/client.js',
		serverEntrypoint: '@solidiom/astrojs-solid-next/server.js',
	};
}
