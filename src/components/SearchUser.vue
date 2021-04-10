<template>

<!-- SEARCH USER INPUT -->
<form class="has-text-left">
  <div class="field">
    <div class="control is-medium">
      <input
        placeholder="Search with username, first name or last name"
        class="input is-medium is-info search-form"
        type="text"
        v-model="state.searchWith"
        v-on:blur="handleFocusLost"
        v-on:keyup="handleKeyUp"
        v-on:keydown="handleEnter"
        autofocus
      />
    </div>

    <!-- SUGGESTIONS -->
    <div class="suggestions">
      <div class="dropdown">
        <div v-for="(player, index) in state.suggestedPlayers" v-bind:key="player.username">
          <div class="suggestion-item" @click="selectPlayer(player)" :class="{'selected': state.selectedIndex === index}">
            <!--<img :src="getAvatar(player)" width="60" height="60" />-->
            <span class="suggestion-result" v-html="highlight(player)"></span>
             (<span class="suggestion-result" v-html="highlightUsername(player.username)"></span>)
          </div>
        </div>
      </div>
    </div>
    <p class="help">Navigate with &uarr; &darr; clear with ESC</p>
    <!-- END OF SUGGESTIONS -->

  </div>
</form>
<!-- END OF SEARCH USER INPUT -->
</template>


<script>
import { inject } from 'vue';
import { reactive } from "vue";
import { gql } from "graphql-request";

// Delay after latest keyup event until sending a request to server
const FETCH_DELAY_MS = 400;

export default {
  setup(props, { emit }) {
    const $client = inject('$client');
    const state = reactive({
      // Text in search form
      searchWith: "",
      // This is used to clean old timers
      timers: [],
      latestKeyUp: Date.now(),
      isFetching: true,
      suggestedPlayers: [],
      // For arrow navigation
      selectedIndex: -1,
    });

  function handleFocusLost() {
      setTimeout(function() {
        state.searchWith = '';
        state.suggestedPlayers = [];
      }, 200);
    }

    function handleEnter(e) {
      if (e.code !== 'Enter')
        return ;
      e.preventDefault();
      if (state.selectedIndex >= 0) {
        let activePlayer = state.suggestedPlayers[state.selectedIndex].username;
        selectPlayer({username: activePlayer});
        state.searchWith = '';
        state.suggestedPlayers = [];
      }
    }

    function handleKeyUp(e) {
      if (isKeyIgnored(e)) return;
      if (handleNavigation(e, state)) return;

      // ESC clears selected player when input is empty
      if (e.key === 'Escape') {
        if (state.searchWith === '') {
          selectPlayer({username: ''})
        }
        state.suggestedPlayers = [];
        state.selectedIndex = -1;
        state.searchWith = '';
        return;
      }
      this.selectedIndex = -1;
      const now = Date.now();
      const delta = now - state.latestKeyUp;
      console.log("delta", delta);
      state.latestKeyUp = now;

      // Enough time has passed, no need for timers
      if (delta >= FETCH_DELAY_MS) {
        fetchSuggestions();
        return;
      }
      // Otherwise wait so server doesn't get spammed

      // Clear old timers
      state.timers.forEach((id) => clearTimeout(id));
      state.timers = [];

      // Create new timeout and push it also to timers
      state.timers.push(
        setTimeout(() => {
          console.log(
            "Waited",
            FETCH_DELAY_MS,
            "ms after latest key relase"
          );
          fetchSuggestions();
        }, FETCH_DELAY_MS - delta)
      );
    }

    async function fetchSuggestions() {
      if (!state.searchWith || state.searchWith === '') {
        state.suggestedPlayers.splice(0, state.suggestedPlayers.length);
        return;
      }

      const variables = {
        prefix: state.searchWith,
      };

      state.isFetching = true;
      const data = await $client.request(query, variables);
      state.isFetching = false;
      state.latestKeyUp = Date.now();
      state.suggestedPlayers.splice(0, state.suggestedPlayers.length);
      data.getUsersWithPrefix.forEach((player) =>
        state.suggestedPlayers.push(player)
      );
    }

    function selectPlayer(player) {
      emit('update', player.username);
      if (player) return;
    }

    // TODO: REFACTOR HIGHLIGHT FUNCTIONS!
    function highlight(player) {
      if (state.searchWith.includes(" ")) {
        return doHighlight(player, state.searchWith);
      }
      let reggie = new RegExp(state.searchWith, "i");
      let str =
        player.firstName + " " + player.lastName;
      let found = str.search(reggie) !== -1;
      let ret = !found
        ? str
        : str.replace(
            reggie,
            '<span style="color:#94da92; text-transform: capitalize;" class="match">' + state.searchWith.toLowerCase() + "</span>"
          );
      return ret;
    }

    function doHighlight(player, keyword) {
      let arr = keyword.split(" ", 2);
      let reggie = new RegExp(arr[0], "i");
      let str = player.firstName;
      let found = str.search(reggie) !== -1;
      let ret = !found
        ? str
        : str.replace(
            reggie,
            '<span style="color:#94da92; text-transform: capitalize;" class="match">' + arr[0].toLowerCase() + "</span>"
          );
      ret += " ";
      let reggie2 = new RegExp(arr[1], "i");
      let str2 = player.lastName;
      let found2 = str2.search(reggie2) !== -1;
      ret += !found2
        ? str2
        : str2.replace(
            reggie2,
            '<span style="color:#94da92; text-transform: capitalize;" class="match">' + arr[1].toLowerCase() + "</span>"
          );
      return ret;
    }

    function highlightUsername(username) {
      let reggie = new RegExp('^' + state.searchWith, "i");
      let str = username;
      let found = str.search(reggie) !== -1;
      let ret = !found
        ? str
        : str.replace(
            reggie,
            '<span style="color:#94da92;" class="match">' + state.searchWith.toLowerCase() + "</span>"
          );
      return ret;
    }

    function getAvatar(player) {
      return state.url + "/image/" + player.avatar;
    }

    return {
      state,
      handleKeyUp,
      handleEnter,
      handleFocusLost,
      selectPlayer,
      getAvatar,
      highlight,
      highlightUsername,
    };
  },
};


function handleNavigation(e, state) {
  e.preventDefault();
  let count = state.suggestedPlayers.length;

  // Reset index when no results
  if (count === 0) {
    state.selectedIndex = -1;
    return;
  }

  // Make toggling only one suggestion possible
  if (count === 1 && state.selectedIndex === 0) {
    state.selectedIndex = -1;
    return;
  }

  if (e.key === 'ArrowDown') {
    if (state.selectedIndex >= (count - 1)) {
      // Index will be increased later so -2
      if (count === 0) {
        state.selectedIndex = -2;
      } else {
        state.selectedIndex = -1;
      }
    }
    state.selectedIndex++;
    return true;
  }
  if (e.key == 'ArrowUp') {
    if (state.selectedIndex <= 0) {
      // Index will be increased later so -2
      if (count === 0) {
        state.selectedIndex = -2;
      } else {
        state.selectedIndex = count;
      }
    }
    state.selectedIndex--;
    return true;
  }
  return false;
}

function isKeyIgnored(e) {
  return (
    !e.code.startsWith("Key") && e.code !== "Backspace" && e.code !== "Delete" &&
    e.code !== 'ArrowDown' && e.code !== 'ArrowUp' && e.code !== "Escape"
  );
}

const query = gql`
  query getUsersWithPrefix($prefix: String!) {
    getUsersWithPrefix(prefix: $prefix) {
      username
      firstName
      lastName
      avatar
    }
  }
`;
</script>




<style scoped>
.search-form {
  color: #000;
  font-family: "Ubuntu";
  font-size: 1.2rem;
  height: 60px;
  background: #f2f4f6;
  border: 0px;
  border-top-left-radius: .4rem;
  border-bottom-left-radius: .4rem;
  margin-top: 2rem;
}

.search-form:focus, .search-form:active {
  border-width: 0;
}

.search-form::placeholder {
  color: #8fa4b9;
  font-size: 1.1rem;
}



h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.label {
  font-size: 14px;
  font-weight: normal;
  color: #777;
}

.suggestions {
  z-index:1000;
  position: relative;
  margin-top: -0.5rem;
}

.dropdown {
  position: absolute;
  top: 10px;
  width: 100%;
  display: block;
  background-color: #202331;
  border-radius: .4rem;
}

.suggestion-item {
  width: 100%;
  display: block;
  font-size: 1.2rem;
  padding: 0.5rem 0 0.5rem 1rem;
  color: #aebcca;
}

.suggestion-item:hover {
  color: #94da92;
  cursor: pointer;
  /* Set border radius same ad .dropdown. Figure seperating top and bottom */
}

.selected {
  background: #3273dc;
  border-radius: .4rem;
}

form {
  margin-bottom: 1rem;
}
.help {
  margin-top: 1rem;
  color: #6c68a8;
}
</style>
