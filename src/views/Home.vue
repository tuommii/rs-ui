<template>

<div class="container">


  <div class="columns is-centered">
    <div class="column is-one-thirds has-text-centered">
      <img v-if="state.selectedPlayer === ''" class="logo" alt="Vue logo" src="../assets/rs_logo_bw.png" width="80">
      <h1 class="title app-title">Raccoon <span>Stats</span></h1>
      <SearchUser @update="logTest"/>
    </div>
  </div>

  <div class="columns is-centered">
    <div class="column is-one-thirds has-text-left">
      <Stats :username="state.selectedPlayer"/>
    </div>
  </div>

  <div class="columns is-centered">
    <div class="column is-one-thirds has-text-centered">
      <a v-if="state.isLoggedIn" class="button is-info settings" href="/settings">Set a tag</a>
      <a v-else class="button is-info settings" href="/settings">Login</a>
    </div>
  </div>

  <!-- <div class="columns is-centered">
    <div class="column is-two-thirds has-text-left">
      <MostRecentGames />
    </div>
  </div> -->

  <!-- <div class="columns is-centered">
    <div class="column is-two-thirds has-text-left">
      <MostRecentTags />
    </div>
  </div> -->
</div>


</template>

<script>

import SearchUser from '../components/SearchUser';
// import MostRecentGames from '../components/MostRecentGames';
// import MostRecentTags from '../components/MostRecentTags';
import Stats from '../components/Stats';
import { reactive, onMounted } from "vue";
import useAuth from "../modules/auth"


export default {
  name: 'Home',
  components: {
    SearchUser,
    // MostRecentGames,
    Stats,
    // MostRecentTags,
  },
  setup() {
    const {getUsername} = useAuth();
    onMounted(() => {
      console.log('username home', getUsername());
    })

    // Global ESC-handler
		window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        state.selectedPlayer = '';
      }
		})

    const state = reactive({
      selectedPlayer: '',
      isLoggedIn: getUsername() !== ''
    });

    function logTest(payload) {
      state.selectedPlayer = payload;
    }

    return {
      logTest,
      state
    }
  }
}
</script>
<style scoped>
.content h1:not(:first-child) {
    margin-top: 0em;
}

.logo {
  margin-top: 2rem;
}

h1 span {
  color: #fce1f6;
}

.app-title {
  font-family: 'Ubuntu';
  font-size: 3rem;
  font-weight: bold;
  color: #1a1b1a;
  margin-top: 0;
  padding-top: 0;
}

.text {
  color: #816ebc;
  font-family: Roboto, serif;
}

.text a {
  color: #e7d4a8;
  /* text-decoration: underline; */
  background: #222;
  padding: 0.25rem;
  border-radius: 4px;
}

.settings {
  background: #5464b6;
  color: #fff;
}

.source {
  color: #373e6c;
}

</style>
