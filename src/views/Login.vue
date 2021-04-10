<template>
	<img alt="Raccoon Stats" src="../assets/rs_logo_bw.png">
	<h1 class="title">Authenticate with GitHub</h1>
	<p>Your GitHub username will be stored in a database and you can
		select a tag for this username. <span class="highlight">If you do not have access to the device, there is no reason to authenticate.</span></p>
	<button @click="loginWithGithub" class="button login">Login with Github</button>
	<button @click="cancel" class="button">Cancel</button>
</template>

<script>
export default {
	name: 'Login',
	components: {},
	setup() {
		function loginWithGithub() {
			window.location.href = process.env.VUE_APP_API + '/login/github';
		}

		function cancel() {
			window.location.href = '/';
		}

		return {
			loginWithGithub,
			cancel
		};
	}
}
</script>
<style scoped>
img {
	margin-top: 1rem;
}
.highlight {
	font-weight: bold;
}
.login {
	margin-right: 0.5rem;
}
</style>
