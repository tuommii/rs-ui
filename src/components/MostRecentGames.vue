<template>
<h2 class="title is-3">Most recent games</h2>
<div class="game" v-for="game in state.games" v-bind:key="game.createdAt">

	<article class="media">
		<figure class="media-left">
			<img src="../../public/pingpong.png" width="48" height="48"/>

		</figure>

		<div class="media-content">
			<div class="content">
				<div>{{game.createdAt.substring(11, 16)}}</div>
				<div>
				<span class="winner">{{game.winner.username}}</span>
				<span class="match-seperator"> - </span>
				<span class="loser">{{game.loser.username}}</span>
				</div>
			</div>
		</div>

		<div>{{game.createdAt.substring(0, 10)}}</div>
	</article>



</div>
</template>

<script>
import { inject } from 'vue';
import { reactive, onMounted } from "vue";
import { gql } from "graphql-request";

export default {
  setup() {
		const $client = inject('$client');
    const state = reactive({
			games: [],
      url: process.env.VUE_APP_API,
    });

    onMounted(() => {
			fetchGames();
    })

    async function fetchGames() {
      state.isFetching = true;
			const variables = {
        count: 3,
      };
      const data = await $client.request(query, variables);
			state.games = data.getMostRecentGames;
    }

    return {
			state
    };
  },
};

const query = gql`
	query getMostRecentGames($count: Int!) {
		getMostRecentGames(count: $count) {
			createdAt
	    sport {
	      name
	    }
	    winner {
	      username
	      firstName
	      lastName
	    }
	    loser {
	      username
	      firstName
	      lastName
	    }
	  }
	}
`;
</script>




<style scoped>

.winner {
	font-weight: bold;
}

.game {
	background: #eee;
	padding-bottom: 0;
	margin-bottom: 1rem;
	max-width: 320px;
}

</style>
