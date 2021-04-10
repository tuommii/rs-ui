<template>
<div id="wrapper">


  <!-- TODO: MAYBE LATER -->
  <div class="has-text-centered" v-if="state.username === ''">
  </div>

  <div v-else>
    <table>
      <caption class="table-title">{{state.username}}</caption>
      <thead>
        <tr>
          <th class="left">Sport</th>
          <th class="left">Opponent</th>
          <th class="number-th">Wins/Games</th>
          <th class="number-th">Your win %</th>
        </tr>
      </thead>
      <tbody>
          <template v-for="sport in state.stats" :key="sport.sportName">
            <template v-for="(opponent, index) in sport.stats" :key="opponent.user.username">


                <template v-if="index === 0">
                  <tr class="first">
                  <td class="sport" :rowspan="sport.stats.length">
                    {{sport.sportName}}
                  </td>
                  <td class="opponent">{{opponent.user.username}}</td>
                  <td class="number-td">{{opponent.stats.wins}} / {{opponent.stats.wins + opponent.stats.losses}}</td>
                  <td class="winp">{{opponent.stats.wins ? Math.round(opponent.stats.wins / (opponent.stats.wins + opponent.stats.losses)*100): 0}}%</td>
                  </tr>
                </template>

                <template v-else>
                  <tr>
                    <td class="opponent">{{opponent.user.username}}</td>
                    <td class="number-td">{{opponent.stats.wins}} / {{opponent.stats.wins + opponent.stats.losses}}</td>
                    <td class="winp">{{opponent.stats.wins ? Math.round(opponent.stats.wins / (opponent.stats.wins + opponent.stats.losses)*100): 0}}%</td>
                  </tr>
                </template>

            </template>
            </template>
     </tbody>
    </table>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import { reactive, onMounted, watch } from "vue";
import { gql } from "graphql-request";

export default {
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const $client = inject('$client');
    const state = reactive({
      isEmpty: true,
      stats: [],
      username: props.username,
      url: process.env.VUE_APP_API
    });

    watch(
      () => props.username,
      (username, prevUsername) => {
        if (username !== prevUsername) {
          state.username = username;
          if (state.username !== '')
            fetchData();
        }
      }
    )

    onMounted(() => {
      if (state.username !== '')
        fetchData();
    })

    async function fetchData() {
      const variables = {
        username: state.username
      };
      const data = await $client.request(query, variables);
      console.log(data);
      if (data.getStatsForUser.stats === null || data.getStatsForUser.stats === undefined)
        state.isEmpty = true;
      else {
        state.isEmpty = false;
      }
      state.stats = {...data.getStatsForUser.stats};
    }

    return {
      state,
    };
  }


}

const query = gql`
query getStatsForUser($username: String!) {
  getStatsForUser(username: $username) {
    stats {
      sportName
      stats {
        user {
          username
        }
        stats {
          wins
          losses
          ties
        }
      }
    }
  }
}
`;

</script>

<style scoped>
table {
  color: #fff;
  border: 0 !important;
}

th {
  border: 0 !important;
}

th.left {
  text-align: left !important;
}

.sport {
  text-align:left;
  vertical-align:middle;
}

.winp {
  /* font-size: 3rem; */
  text-align:right;
  vertical-align: middle;
}

.number-td {
  text-align:right;
  vertical-align: middle;
}

th {
  border: 0;
  font-size: 0.8rem;
  color:#2e4959 !important;
}

td {
  border: 0;
}

.first td {
  border-top: 0px solid #eee;
}

.opponent {
  vertical-align: middle;
}

.content table th:not([align]) {
  text-align: right;
}

.content table th .left {
  text-align: left !important;
}

.text-overlay {
  top: 0;
}

.title {
  color: rgb(235, 199, 166);
  position: relative;
  top: -180px;
  text-transform: uppercase;
  font-family: 'Ubuntu';
  font-weight: bold;
  font-size: 1.5rem;
}

.logo-container {
  text-align: center;
}

.logo-container img {
  opacity: 0.65;
}

@keyframes taadaa {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.table-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #371e4a;
}
</style>
