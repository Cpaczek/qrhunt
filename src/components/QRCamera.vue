<template>
  <div class="camera">
    <qrcode-stream class="video"  @decode="onDecode" :camera="camera" @init="onInit">
      <button class="bg-white" @click="switchCamera">
        <img src="../assets/camera-switch.svg" alt="switch camera">
      </button>
    </qrcode-stream>
    {{QRValue}}
  </div>
</template>

<script setup>
import {ref} from 'vue'
const emit = defineEmits(['decoded'])
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
let QRValue = ref('')
let camera = ref('auto')
let noRearCamera = ref(false)
let noFrontCamera = ref(false)
async function  onDecode (content) {
  QRValue.value = content
  try{
    JSON.parse(content)
  }catch (e){
    await Swal.fire({
      title: 'Error!',
      text: 'Invalid QR Code',
      icon: 'error',
      confirmButtonText: 'Retry'
    })
    return
  }
  emit('decoded', content);
}

async function onInit (promise) {
  try {
    await promise
  } catch (error) {
    const triedFrontCamera = camera.value === 'front'
    const triedRearCamera = camera.value === 'rear'

    const cameraMissingError = error.name === 'OverconstrainedError'

    if (triedRearCamera && cameraMissingError) {
      noRearCamera.value = true
    }

    if (triedFrontCamera && cameraMissingError) {
      noFrontCamera.value = true
    }

    console.error(error)
  }
}
function switchCamera () {
  switch (camera.value) {
    case 'front':
      camera.value = 'rear'
      break
    case 'rear':
      camera.value = 'front'
      break
  }
}
</script>
<style scoped>
.camera {
  display: flex;
  flex-direction: column;
}
.video{
  margin: auto;
  width: auto !important;
  /*height: 50vh;*/
}
</style>
