<template>
  <div class="home">
    <h1>Welcome to Egg Hunt</h1>
<!--    Egg picture-->
    <img class="h-[10vh] m-auto" src="https://pngimg.com/uploads/egg/egg_PNG40783.png" alt="egg">
<div class="flex w-[200px] m-auto gap-2 flex-col">
  <router-link class="btn" to="/gamestart"> Start Game</router-link>
  <span v-if="currentUser">Curren User ID: {{currentUser}}</span>
  <button v-if="currentUser" class="btn" @click="resetGame">Logout</button>
</div>

  </div>
</template>

<script setup>
import {defineComponent, ref} from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import QRCamera from '../components/QRCamera.vue'
let currentUser = ref(null)
function resetGame(){
  //removes userID from local storage
  currentUser.value = null
  localStorage.removeItem('userID')
}
currentUser.value = localStorage.getItem('userID')
defineComponent({
  name: 'Home',
  components: {
    QRCamera,
  },
})
</script>
