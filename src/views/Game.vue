<template>
  <div class="home">
    <h1>Scan Code</h1>
    <br>
    <button @click="scanning = !scanning">Scan Code</button>
    <br>
    <QRCamera v-if="scanning" @decoded="onDecode"></QRCamera>
  </div>
</template>

<script setup>
import {defineComponent, ref} from 'vue'
import QRCamera from '../components/QRCamera.vue'
let scanning = ref(false)
function onDecode(data){
  // scanning.value = false;
  console.log(data);
}
defineComponent({
  name: 'Home',
  components: {
    QRCamera,
  },
})
</script>
