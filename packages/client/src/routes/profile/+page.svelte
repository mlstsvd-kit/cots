<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import AuthService from '$lib/services/auth';
	import type { PlayerProfile } from '$lib/types/player';
	
	let profile = $state<PlayerProfile | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	
	onMount(async () => {
	if (!browser) return;
		
		try {
			const user = await AuthService.getUser();
			if (user) {
				profile = user as PlayerProfile;
			} else {
				error = 'Пользователь не авторизован';
			}
		} catch (err) {
			error = 'Ошибка загрузки профиля';
			console.error('Profile load error:', err);
		} finally {
			loading = false;
		}
	});
</script>

<div class="profile-page">
	{#if loading}
		<p>Загрузка профиля...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if profile}
		<div class="profile-card">
			<div class="profile-header">
				{#if profile.avatar}
					<img src={profile.avatar} alt="Аватар" class="avatar" />
				{/if}
				<h1>{profile.username}</h1>
			</div>
			
			<div class="profile-stats">
				<div class="stat">
					<h3>Мощь духа</h3>
					<p>{profile.power}</p>
				</div>
				<div class="stat">
					<h3>Внутренняя гармония</h3>
					<p>{profile.harmony}</p>
				</div>
				<div class="stat">
					<h3>Глубина понимания</h3>
					<p>{profile.understanding}</p>
				</div>
			</div>
			
			<div class="profile-details">
				<div class="detail">
					<h3>Email</h3>
					<p>{profile.email}</p>
				</div>
				<div class="detail">
					<h3>Дата регистрации</h3>
					<p>{new Date(profile.createdAt).toLocaleDateString('ru-RU')}</p>
				</div>
				{#if profile.lastLoginAt}
				<div class="detail">
					<h3>Последний вход</h3>
					<p>{new Date(profile.lastLoginAt).toLocaleDateString('ru-RU')}</p>
				</div>
				{/if}
			</div>
		</div>
	{/else}
		<p>Профиль недоступен</p>
	{/if}
</div>

<style>
	.profile-page {
		max-width: 800px;
		margin: 0 auto;
	padding: 2rem;
	}
	
	.profile-card {
	background-color: #f8f9fa;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	
	.profile-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	
	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
	}
	
	.profile-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}
	
	.stat {
		background-color: white;
		padding: 1rem;
		border-radius: 4px;
		text-align: center;
	}
	
	.stat h3 {
		margin: 0 0 0.5rem 0;
		color: #6c757d;
	}
	
	.stat p {
	font-size: 1.5rem;
		margin: 0;
		font-weight: bold;
	}
	
	.profile-details {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}
	
	.detail {
		background-color: white;
		padding: 1rem;
		border-radius: 4px;
	}
	
	.detail h3 {
		margin: 0 0 0.5rem 0;
		color: #6c757d;
	}
	
	.detail p {
		margin: 0;
	}
	
	.error {
		color: #dc3545;
		text-align: center;
	}
</style>