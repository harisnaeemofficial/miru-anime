import { createApp } from 'vue'
import App from './App.vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import router from './router'
import configData from './config.json'
const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  cache,
  uri: configData.anilist_graphql_api,
})
const apolloProvider = createApolloProvider({
    defaultClient: apolloClient,
})
import './index.css'
createApp(App).use(router).use(apolloProvider).mount('#app')
