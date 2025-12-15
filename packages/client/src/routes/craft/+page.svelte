<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	// Типы для крафта
	interface Rudiment {
		id: string;
		name: string;
		description: string;
		baseType: string;
		elementType: string;
	}
	
	interface Fragment {
		id: string;
		name: string;
		description: string;
		essence: string;
	}
	
	interface Essence {
		id: string;
		name: string;
		element: string;
		description: string;
	}
	
	interface CraftRecipe {
		rudimentId: string;
		fragmentIds: string[];
		essence: string;
	}
	
	let rudiments = $state<Rudiment[]>([]);
	let fragments = $state<Fragment[]>([]);
	let essences = $state<Essence[]>([]);
	let selectedRudiment = $state<string>('');
	let selectedFragments = $state<string[]>([]);
	let selectedEssence = $state<string>('');
	let loading = $state(true);
	let error = $state<string | null>(null);
	let craftingResult = $state<any>(null);
	
	onMount(async () => {
		if (!browser) return;
		
		try {
			// Загружаем доступные компоненты для крафта
			const [rudimentsRes, fragmentsRes, essencesRes] = await Promise.all([
				fetch('/api/craft/rudiments'),
				fetch('/api/craft/fragments'),
				fetch('/api/craft/essences')
			]);
			
			if (rudimentsRes.ok) {
				const rudimentsData = await rudimentsRes.json();
				rudiments = rudimentsData.rudiments;
			}
			
			if (fragmentsRes.ok) {
				const fragmentsData = await fragmentsRes.json();
				fragments = fragmentsData.fragments;
			}
			
			if (essencesRes.ok) {
				const essencesData = await essencesRes.json();
				essences = essencesData.essences;
			}
		} catch (err) {
			error = 'Ошибка загрузки компонентов для крафта';
			console.error('Craft components load error:', err);
		} finally {
			loading = false;
		}
	});
	
	const craftTechnique = async () => {
		if (!selectedRudiment || selectedFragments.length === 0 || !selectedEssence) {
			error = 'Необходимо выбрать все компоненты для крафта';
			return;
		}
		
		const recipe: CraftRecipe = {
			rudimentId: selectedRudiment,
			fragmentIds: selectedFragments,
			essence: selectedEssence
		};
		
		try {
			const response = await fetch('/api/craft/technique', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(recipe)
			});
			
			if (response.ok) {
				const result = await response.json();
				craftingResult = result.technique;
				error = null;
			} else {
				const errorData = await response.json();
				error = errorData.error || 'Ошибка при создании техники';
			}
		} catch (err) {
			error = 'Ошибка при отправке запроса на крафт';
			console.error('Craft error:', err);
		}
	};
	
	const toggleFragment = (fragmentId: string) => {
	if (selectedFragments.includes(fragmentId)) {
			selectedFragments = selectedFragments.filter(id => id !== fragmentId);
		} else {
			// Ограничиваем количество выбранных фрагментов (максимум 3)
			if (selectedFragments.length < 3) {
				selectedFragments = [...selectedFragments, fragmentId];
			}
		}
	};
</script>

<div class="craft-page">
	<h1>Мастерская Сознания</h1>
	
	{#if loading}
		<p>Загрузка компонентов для крафта...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else}
		<div class="crafting-area">
			<div class="component-selection">
				<div class="selection-section">
					<h2>Рудимент (база техники)</h2>
					<div class="rudiment-list">
						{#each rudiments as rudiment}
							<div class="rudiment-option" 
								 class:selected={selectedRudiment === rudiment.id}
								 on:click={() => selectedRudiment = rudiment.id}>
								<h3>{rudiment.name}</h3>
								<p>{rudiment.description}</p>
								<span class="type">{rudiment.baseType} | {rudiment.elementType}</span>
							</div>
						{/each}
					</div>
				</div>
				
				<div class="selection-section">
					<h2>Фрагменты Понимания (модификаторы)</h2>
					<p>Выбрано: {selectedFragments.length}/3</p>
					<div class="fragment-list">
						{#each fragments as fragment}
							<div class="fragment-option" 
								 class:selected={selectedFragments.includes(fragment.id)}
								 class:disabled={selectedFragments.length >= 3 && !selectedFragments.includes(fragment.id)}
								 on:click={() => toggleFragment(fragment.id)}>
								<h3>{fragment.name}</h3>
								<p>{fragment.description}</p>
								<span class="essence">Эссенция: {fragment.essence}</span>
							</div>
						{/each}
					</div>
				</div>
				
				<div class="selection-section">
					<h2>Эссенция (стиль)</h2>
					<div class="essence-list">
						{#each essences as essence}
							<div class="essence-option" 
								 class:selected={selectedEssence === essence.id}
								 on:click={() => selectedEssence = essence.id}>
								<h3>{essence.name}</h3>
								<p>{essence.description}</p>
								<span class="element">Стихия: {essence.element}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
			
			<div class="crafting-controls">
				<button on:click={craftTechnique} disabled={!selectedRudiment || selectedFragments.length === 0 || !selectedEssence}>
					Создать технику
				</button>
				
				{#if craftingResult}
					<div class="crafting-result">
						<h3>Созданная техника:</h3>
						<h4>{craftingResult.name}</h4>
						<p>{craftingResult.description}</p>
						<div class="technique-stats">
							<span>Стихия: {craftingResult.elementType}</span>
							<span>Тип: {craftingResult.baseType}</span>
							<span>Уровень: {craftingResult.level}</span>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.craft-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.crafting-area {
		display: grid;
		grid-template-columns: 3fr 1fr;
		gap: 2rem;
	}
	
	.component-selection {
		display: flex;
	flex-direction: column;
		gap: 2rem;
	}
	
	.selection-section {
		background-color: #f8f9fa;
		padding: 1.5rem;
	border-radius: 8px;
	}
	
	.rudiment-list, .fragment-list, .essence-list {
		display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 1rem;
		margin-top: 1rem;
	}
	
	.rudiment-option, .fragment-option, .essence-option {
		padding: 1rem;
		border: 2px solid #e9ecef;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.rudiment-option:hover, .fragment-option:hover, .essence-option:hover {
		border-color: #007bff;
		background-color: #e9f7fe;
	}
	
	.rudiment-option.selected, .fragment-option.selected, .essence-option.selected {
		border-color: #28a745;
		background-color: #f0fff4;
	}
	
	.fragment-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.type, .essence, .element {
		display: block;
		font-size: 0.875rem;
		color: #6c757d;
		margin-top: 0.5rem;
	}
	
	.crafting-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	button {
		padding: 0.75rem 1.5rem;
		background-color: #007bff;
	color: white;
	border: none;
	border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}
	
	button:hover:not(:disabled) {
		background-color: #0056b3;
	}
	
	button:disabled {
	background-color: #6c757d;
		cursor: not-allowed;
	}
	
	.crafting-result {
		margin-top: 1rem;
		padding: 1rem;
	background-color: #d4edda;
		border: 1px solid #c3e6cb;
		border-radius: 4px;
	}
	
	.technique-stats {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	flex-wrap: wrap;
	}
	
	.technique-stats span {
		background-color: #ffffff;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
	}
	
	.error {
		color: #dc3545;
		background-color: #f8d7da;
		padding: 1rem;
		border-radius: 4px;
		text-align: center;
	}
</style>