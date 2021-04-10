<template>
<h2 class="title is-3">Latest available tags scanned</h2>

<div class="tag-scanned" v-for="tag in state.tags" v-bind:key="tag.id">
	<div><a @click="handleClick(tag.id)">{{tag.id}}</a> <span>{{tag.createdAt.substring(0, 16)}}</span></div>
</div>


</template>

<script>
import { inject } from 'vue';
import { reactive, onMounted } from "vue";
import { gql } from "graphql-request";
import useAuth from '../modules/auth';

export default {
  setup() {
    const {getToken} = useAuth();
		const $client = inject('$client');
    const state = reactive({
			tags: [],
      url: process.env.VUE_APP_API,
    });

    onMounted(() => {
			fetchTags();
    })

    function handleClick(id) {
      console.log('id', id);
        let sure = confirm('Are you sure?');
        if (sure)
          setRFID(id);
    }

    async function setRFID(tagValue) {
      if (tagValue === null || tagValue === '')
        return;
			const variables = {
        tag: tagValue,
        token: getToken()
      };
      const data = await $client.request(addRFIDQuery, variables);
			console.log(data.createRFIDForUser);
      window.location.href = '/';
    }

    async function fetchTags() {
			const variables = {
        count: 3,
        token: getToken()
      };
      const data = await $client.request(query, variables);
			state.tags = data.getLatestAvailableTags;
    }

    return {
			state,
      handleClick
    };
  },
};

const query = gql`
  query getLatestAvailableTags($token: String!, $count: Int!) {
		getLatestAvailableTags(token: $token, count: $count) {
	    id
	    createdAt
		}
  }
`;

const addRFIDQuery = gql`
  mutation createRFIDForUser($token: String!, $tag: String!) {
    createRFIDForUser(token: $token, tag: $tag)
  }
`;


</script>




<style scoped>
.tag {
	display: block;
}
</style>
