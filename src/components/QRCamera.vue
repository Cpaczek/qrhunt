<template>
  <div class="home">
    <qrcode-stream  @decode="onDecode" :camera="camera" @init="onInit">
      <button @click="switchCamera">
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
let camera = ref('PREFERRED')
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
// function paintOutline (detectedCodes, ctx) {
//   for (const detectedCode of detectedCodes) {
//     const [ firstPoint, ...otherPoints ] = detectedCode.cornerPoints
//
//     ctx.strokeStyle = "red";
//
//     ctx.beginPath();
//     ctx.moveTo(firstPoint.x, firstPoint.y);
//     for (const { x, y } of otherPoints) {
//       ctx.lineTo(x, y);
//     }
//     ctx.lineTo(firstPoint.x, firstPoint.y);
//     ctx.closePath();
//     ctx.stroke();
//   }
// }
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
  console.log('switch camera', camera.value)
  switch (camera.value) {
    case 'front':
      camera.value = 'rear'
      break
    case 'rear':
      camera.value = 'PREFERRED'
      break
    case 'PREFERRED':
      camera.value = 'front'
      break
  }
}
</script>
