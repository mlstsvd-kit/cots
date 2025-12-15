<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	// Типы для духов
	interface Spirit {
		id: string;
		name: string;
		description: string;
		element: string;
		character: string;
		uniqueMechanic: string;
		isActive: boolean;
	}
	
	let spirits = $state<Spirit[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	
	onMount(async () => {
		if (!browser) return;
		
		try {
			const response = await fetch('/api/spirits');
			if (response.ok) {
				spirits = await response.json();
			} else {
				throw new Error('Failed to load spirits');
			}
		} catch (err) {
			error = 'Ошибка загрузки духов';
			console.error('Spirits load error:', err);
		} finally {
			loading = false;
		}
	});
</script>

<div class="spirits-page">
	<h1>Духи Пробуждённых Душ</h1>
	
	{#if loading}
		<p>Загрузка духов...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if spirits.length > 0}
		<div class="spirits-grid">
			{#each spirits as spirit (spirit.id)}
				<div class="spirit-card">
					<h2>{spirit.name}</h2>
					<p class="element">Стихия: {spirit.element}</p>
					<p class="character">Характер: {spirit.character}</p>
					<p class="description">{spirit.description}</p>
					<div class="unique-mechanic">
						<h3>Уникальная механика:</h3>
						<p>{spirit.uniqueMechanic}</p>
					</div>
				</div>
			{/each}
	</div>
	{:else}
		<p>Духи не найдены</p>
	{/if}
</div>

<style>
	.spirits-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.spirits-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}
	
	.spirit-card {
		background-color: #f8f9fa;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border-left: 4px solid #007bff;
	}
	
	.spirit-card h2 {
		margin-top: 0;
		color: #343a40;
	}
	
	.element, .character {
		font-weight: bold;
		color: #495057;
	}
	
	.description {
		margin: 1rem 0;
		color: #6c757d;
		line-height: 1.6;
	}
	
	.unique-mechanic {
		background-color: #e9ecef;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 1rem;
	}
	
	.unique-mechanic h3 {
		margin-top: 0;
		color: #495057;
	}
	
	.error {
		color: #dc3545;
		text-align: center;
	}
</style>