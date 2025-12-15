import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			mode: 'development',
			base: '/',
			scope: '/',
			manifest: {
				name: 'Хроники Пробуждённых Душ',
				short_name: 'ХПД',
				description: 'Текстовая MMO в сеттинге фэнтези древних культов',
				theme_color: '#00000',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	]
});