<script setup>
import { provide } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'


// HTTP connection to the API

const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_GRAPHQL_URL,
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})
provide(DefaultApolloClient, apolloClient)
</script>

<template>
  <div class="m-10">
    <router-view></router-view>
  </div>

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
