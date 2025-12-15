<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	// Типы для боя
	interface Technique {
		id: string;
	name: string;
	elementType: string;
		baseType: string;
		rudimentId: string;
	}
	
	interface Location {
		id: string;
		name: string;
		element: string;
		level: number;
	}
	
	interface BattleSetup {
	playerTechniques: Technique[];
		enemyTechniques: Technique[];
		location: string;
	}
	
	let techniques = $state<Technique[]>([]);
	let locations = $state<Location[]>([]);
	let selectedTechniques = $state<string[]>([]);
	let selectedLocation = $state<string>('');
	let loading = $state(true);
	let error = $state<string | null>(null);
	let battleResult = $state<any>(null);
	let battleLog = $state<string[]>([]);
	let battleActive = $state(false);
	
	onMount(async () => {
		if (!browser) return;
		
		try {
			// Загружаем доступные техники и локации
			const [techniquesRes, locationsRes] = await Promise.all([
				fetch('/api/battle/techniques'),
				fetch('/api/battle/locations')
			]);
			
			if (techniquesRes.ok) {
				const techniquesData = await techniquesRes.json();
				techniques = techniquesData.techniques;
			}
			
			if (locationsRes.ok) {
				const locationsData = await locationsRes.json();
				locations = locationsData.locations;
			}
		} catch (err) {
			error = 'Ошибка загрузки данных для боя';
			console.error('Battle data load error:', err);
		} finally {
			loading = false;
		}
	});
	
	const toggleTechnique = (techniqueId: string) => {
	if (selectedTechniques.includes(techniqueId)) {
			selectedTechniques = selectedTechniques.filter(id => id !== techniqueId);
		} else {
			// Ограничиваем количество выбранных техник (максимум 6)
			if (selectedTechniques.length < 6) {
				selectedTechniques = [...selectedTechniques, techniqueId];
			}
		}
	};
	
	const startBattle = async () => {
		if (selectedTechniques.length === 0 || !selectedLocation) {
			error = 'Необходимо выбрать техники и локацию для боя';
			return;
		}
		
		// Получаем полные объекты выбранных техник
		const playerTechs = techniques.filter(t => selectedTechniques.includes(t.id));
		
		// Создаем бой с ботом (временные данные)
		const battleSetup: BattleSetup = {
			playerTechniques: playerTechs,
			enemyTechniques: [
				{ id: 'bot-tech-1', name: 'Бот-Таран', elementType: 'fire', baseType: 'damage', rudimentId: 'rud-1' },
				{ id: 'bot-tech-2', name: 'Бот-Крик', elementType: 'fire', baseType: 'control', rudimentId: 'rud-2' }
			],
			location: selectedLocation
	};
		
		try {
			battleActive = true;
			battleLog = ['Бой начинается...'];
			
			const response = await fetch('/api/battle/start', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(battleSetup)
			});
			
			if (response.ok) {
				const result = await response.json();
				battleResult = result;
				
				// Обновляем лог боя
				battleLog = result.log.map((entry: any) => entry.action);
				
				battleActive = false;
			} else {
				const errorData = await response.json();
				error = errorData.error || 'Ошибка при начале боя';
				battleActive = false;
			}
		} catch (err) {
			error = 'Ошибка при отправке запроса на бой';
			battleActive = false;
			console.error('Battle error:', err);
		}
	};
</script>

<div class="battle-page">
	<h1>Боевой Настрой</h1>
	
	{#if loading}
		<p>Загрузка данных для боя...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else}
		<div class="battle-setup">
			<div class="selection-panel">
				<div class="selection-section">
					<h2>Локация</h2>
					<div class="location-list">
						{#each locations as location}
							<div class="location-option" 
								 class:selected={selectedLocation === location.id}
								 on:click={() => selectedLocation = location.id}>
								<h3>{location.name}</h3>
								<p>Стихия: {location.element} | Уровень: {location.level}</p>
							</div>
						{/each}
					</div>
				</div>
				
				<div class="selection-section">
					<h2>Техники (Выбрано: {selectedTechniques.length}/6)</h2>
					<div class="technique-list">
						{#each techniques as technique}
							<div class="technique-option" 
								 class:selected={selectedTechniques.includes(technique.id)}
								 class:disabled={selectedTechniques.length >= 6 && !selectedTechniques.includes(technique.id)}
								 on:click={() => toggleTechnique(technique.id)}>
								<h3>{technique.name}</h3>
								<p>Стихия: {technique.elementType} | Тип: {technique.baseType}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
			
			<div class="battle-controls">
				<button on:click={startBattle} 
						disabled={selectedTechniques.length === 0 || !selectedLocation || battleActive}>
					{battleActive ? 'Бой в процессе...' : 'Начать бой'}
				</button>
				
				{#if battleResult}
					<div class="battle-result">
						<h3>Результат боя:</h3>
						<p>Победитель: {battleResult.winner}</p>
						<p>Длительность: {Math.round(battleResult.duration / 100)} сек</p>
					</div>
				{/if}
			</div>
		</div>
		
		{#if battleLog.length > 0}
			<div class="battle-log">
				<h2>Лог боя:</h2>
				<div class="log-entries">
					{#each battleLog as entry, i}
						<p key={i}>{entry}</p>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.battle-page {
		max-width: 1200px;
		margin: 0 auto;
	padding: 2rem;
	}
	
	.battle-setup {
		display: grid;
		grid-template-columns: 3fr 1fr;
		gap: 2rem;
	}
	
	.selection-panel {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	
	.selection-section {
		background-color: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
	}
	
	.location-list, .technique-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}
	
	.location-option, .technique-option {
		padding: 1rem;
	border: 2px solid #e9ecef;
		border-radius: 4px;
		cursor: pointer;
	transition: all 0.2s;
	}
	
	.location-option:hover, .technique-option:hover {
		border-color: #007bff;
		background-color: #e9f7fe;
	}
	
	.location-option.selected, .technique-option.selected {
		border-color: #28a745;
		background-color: #f0fff4;
	}
	
	.technique-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.battle-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	button {
		padding: 0.75rem 1.5rem;
		background-color: #dc3545;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	font-size: 1rem;
	}
	
	button:hover:not(:disabled) {
		background-color: #c82333;
	}
	
	button:disabled {
	background-color: #6c757d;
		cursor: not-allowed;
	}
	
	.battle-result {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #d4edda;
		border: 1px solid #c3e6cb;
		border-radius: 4px;
	}
	
	.battle-log {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: #212529;
		color: #ffffff;
		border-radius: 8px;
	}
	
	.log-entries {
		max-height: 400px;
		overflow-y: auto;
		line-height: 1.6;
	}
	
	.error {
		color: #dc3545;
		background-color: #f8d7da;
		padding: 1rem;
		border-radius: 4px;
		text-align: center;
	}
</style>