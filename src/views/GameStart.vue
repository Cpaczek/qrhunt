<template>
  <div class="home">
    <h1>Scan Your Starting QR Code</h1>
    <QRCamera @decoded="onDecode"></QRCamera>
  </div>
</template>

<script setup>
import {defineComponent, onMounted} from 'vue'
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import QRCamera from '../components/QRCamera.vue'
import router from "../router";
//mounted
onMounted(() => {
  //Check if userID exists
  if(localStorage.getItem('userID') !== null){
    // go next page
    router.push('/game')
  }
})
function onDecode(content){
  console.log('decoded', content)
  let parsed;
  try{
    parsed = JSON.parse(content)
  }catch (e){
    Swal.fire({
      title: 'Error!',
      text: 'Invalid QR Code',
      icon: 'error',
      confirmButtonText: 'Retry'
    })
    return
  }
  if(!parsed.userID){
    Swal.fire({
      title: 'Error!',
      text: 'Thats not a starting egg code',
      icon: 'error',
      confirmButtonText: 'Retry'
    })
  }
  //store userID in local storage
  localStorage.setItem('userID', parsed.userID)
  router.push('/game')

}
defineComponent({
  name: 'Home',
  components: {
    QRCamera,
  },
})
</script>
