<template>
  <div class="home">
    <h1>Welcome to Egg Hunt</h1>
    <router-link to="/gamestart"> Start Game</router-link>
    <br>
    <button @click="resetGame">Reset</button>
  </div>
</template>

<script setup>
import {defineComponent} from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import QRCamera from '../components/QRCamera.vue'
function resetGame(){
  //removes userID from local storage
  localStorage.removeItem('userID')
}
defineComponent({
  name: 'Home',
  components: {
    QRCamera,
  },
})
</script>
