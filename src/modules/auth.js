import { reactive, toRefs } from 'vue';

const state = reactive({
	isAuthenticated: false,
	token: '',
	username: '',
});

export default function useAuth() {
	const setAuthenticated = () => {
		state.isAuthenticated = true;
	}
	const getAuthenticated = () => state.isAuthenticated;

	const getToken = () => state.token;
	const setToken = (token) => state.token = token;

	const getUsername = () => state.username;
	const setUsername = (username) => state.username = username;

	return {
		...toRefs(state),
		setAuthenticated,
		getAuthenticated,
		getToken,
		setToken,
		getUsername,
		setUsername,
	}
}
