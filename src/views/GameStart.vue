<template>
  <div class="home">
    <h1>Scan Your Starting QR Code</h1>
    <QRCamera @decoded="onDecode"></QRCamera>
    <div class="flex flex-row justify-center">
      <div class="flex flex-col w-1/2">
        <label class="text-left text-sm italic">Manual ID:</label>
        <input @keydown.enter="manualLogin" type="text" v-model="manualOverride"/>
      </div>
      <button @click="manualLogin()" class="btn mt-5 ml-2">Submit</button>
    </div>

  </div>
</template>

<script setup>
import {defineComponent, onMounted, ref} from 'vue'
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import QRCamera from '../components/QRCamera.vue'
import router from "../router";
import {useMutation} from "@vue/apollo-composable";
import gql from "graphql-tag";

let manualOverride = ref('');
//mounted
onMounted(() => {
  //Check if userID exists
  if (localStorage.getItem('userID') !== null) {
    // go next page
    router.push('/game')
  }
})
function manualLogin() {
  if (manualOverride.value === '') {
    Swal.fire({
      title: 'Error',
      text: 'Please enter a valid ID',
      type: 'error',
      confirmButtonText: 'Ok'
    })
  }
  login(manualOverride.value)

}

async function login(name) {
  localStorage.setItem('userID', name)
  manualOverride.value = ''
  await router.push('/game')

}

function onDecode(content) {
  let parsed;
  try {
    parsed = JSON.parse(content)
  } catch (e) {
    Swal.fire({
      title: 'Error!',
      text: 'Invalid QR Code',
      icon: 'error',
      confirmButtonText: 'Retry'
    })
    return
  }
  if (!parsed.userID) {
    Swal.fire({
      title: 'Error!',
      text: 'Thats not a starting egg code',
      icon: 'error',
      confirmButtonText: 'Retry'
    })
    return
  }
  //store userID in local storage
  login(parsed.userID)

}

defineComponent({
  name: 'Home',
  components: {
    QRCamera,
  },
})
</script>
