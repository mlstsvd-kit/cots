<script>
	import '../app.css';
	
	// Типы для TypeScript
	export let data;
	export let session;
</script>

<!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="utf-8" />
		<title>Хроники Пробуждённых Душ</title>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="icon" href="/favicon.png" />
		<link rel="stylesheet" href="%sveltekit.assets%/global.css" />
	</head>
	<body>
	<div class="app-container">
			<header class="app-header">
				<h1>Хроники Пробуждённых Душ</h1>
				<nav class="app-nav">
					<a href="/">Главная</a>
					<a href="/dashboard">Панель управления</a>
					<a href="/spirits">Духи</a>
					<a href="/craft">Крафт</a>
					<a href="/battle">Бой</a>
				</nav>
			</header>
			
			<main class="app-main">
				<svelte:fragment slot="default">
					{@render $page.body}
				</svelte:fragment>
			</main>
			
			<footer class="app-footer">
				<p>© 2025 Хроники Пробуждённых Душ. Все права защищены.</p>
			</footer>
	</div>
	</body>
</html>