<template>
  <h1>Settings</h1>
	<div>
		<img alt="Raccoon Stats" src="../assets/rs_logo_bw.png">
		<MostRecentTags />
		<br>
		<button @click="back" class="button">Back</button>
	</div>
</template>

<script>
import MostRecentTags from '../components/MostRecentTags';

export default {
  name: 'Settings',
	components: {
		MostRecentTags
	},
  setup() {
		function back() {
			window.location.href = '/';
		}
		return {
			back
		}
  }
}
</script>
