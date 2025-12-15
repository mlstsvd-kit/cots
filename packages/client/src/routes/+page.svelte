<script>
	import { onMount } from 'svelte';
	import AuthService from '$lib/services/auth';
	
	let user = $state(null);
	let loading = $state(true);
	
	onMount(async () => {
		user = await AuthService.getUser();
		loading = false;
	});
	
	const handleLogin = (provider) => {
		AuthService.initiateOAuth(provider);
	};
	
	const handleLogout = async () => {
		const success = await AuthService.logout();
		if (success) {
			user = null;
	}
	};
</script>

<div class="home-page">
	{#if loading}
		<p>Загрузка...</p>
	{:else}
		{#if user}
			<div class="user-section">
				<h2>Добро пожаловать, {user.username}!</h2>
				<p>Мощь духа: {user.power}</p>
				<p>Внутренняя гармония: {user.harmony}</p>
				<p>Глубина понимания: {user.understanding}</p>
				<button on:click={handleLogout}>Выйти</button>
			</div>
		{:else}
			<div class="auth-section">
				<h2>Войти в игру</h2>
				<button on:click={() => handleLogin('yandex')}>Войти через Яндекс</button>
				<button on:click={() => handleLogin('google')}>Войти через Google</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.home-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
		text-align: center;
	}
	
	.user-section, .auth-section {
		padding: 2rem;
		border-radius: 8px;
		background-color: #f8f9fa;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	
	button {
		margin: 0.5rem;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
	color: white;
	cursor: pointer;
		font-size: 1rem;
	}
	
	button:hover {
		background-color: #0056b3;
	}
</style>