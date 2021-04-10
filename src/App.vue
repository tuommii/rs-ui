<template>
	<div class="is-widescreen">
		<div class="columns is-centered">
			<div class="column is-half content">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>
import "../node_modules/bulma/css/bulma.min.css";
// import MostRecentGames from './components/MostRecentGames';
// import MostRecentTags from './components/MostRecentTags';
export default {
	name: 'App',
	components: {
		// MostRecentGames,
		// MostRecentTags
	}
}
</script>

<style>

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

html, body {
	background: #fff;
	height:100vh;
	background-image: linear-gradient(285deg,#976cdb,#c2c5e7 80%);
	margin: 0;
	padding: 0;
}

.app-title {
	color: #fff;
	font-weight: bold;
	font-size: 2rem;
}
</style>
