import { GraphQLClient } from 'graphql-request';

let url = "api/graphql";

if (process.env.VUE_APP_ENV === 'dev') {
	url = process.env.VUE_APP_API + "/api/graphql";
}

const client = new GraphQLClient(url)
client.setHeader('Content-Type', 'application/json')
export default client
