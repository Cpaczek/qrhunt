<template>
  <div class="home">

    <h1>QR Hunt</h1>
    <div v-if="debug">
    <span >Currently Logged in as: {{userID}}</span> <br>
    <span >Target Egg ID: {{result?.player?.targetEgg?.id}}</span><br>
    <span >Target Egg Name: {{result?.player?.targetEgg?.name}}</span><br>
    <span >Target Egg Riddle: {{result?.player?.targetEgg?.riddle}}</span><br>
    <span >Player Name: {{result?.player?.name}}</span> <br>
    <router-link  class="btn mt-2" to="/">Home</router-link>
    </div>


    <div class="flex gap-10 flex-row flex-wrap justify-center items-center mt-4 w-full">
      <div class="text-left">
<!--        instructions-->
        <h2>Welcome to QR Hunt</h2>
        <p>
          This is a game where you need to find the QR codes.
          <br>

          You can scan the QR codes by clicking the button below.
          <br>
          If you want to play the game manually, you can enter the code manually.</p>
      </div>
      <div class="flex flex-col justify-center">
        <button v-if="!scanning" class="btn" @click="scanning = !scanning">Scan Code</button>
        <button v-else class="btn" @click="scanning = !scanning">Hide Scanner</button>
        <QRCamera class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" v-if="scanning" @decoded="onDecode"></QRCamera>
        <div class="flex flex-row justify-center items-center mt-4 w-full">
          <div class="flex flex-col">
            <label  class="text-left text-sm italic">Manual Code:</label>
            <input @keydown.enter="submitEgg" type="text" v-model="manualOverride"/>
          </div>

          <button  @click="submitEgg()" class="btn mt-7 ml-2">Submit</button>
        </div>

      </div>
    </div>


    <div class="flex justify-items-center justify-evenly flex-col content-between p-[10px] bg-primary-300 border-8 border-primary md:w-1/2 md:m-auto m-5 rounded-xl">
      <div class="flex flex-col">
        <div class="col-span-12 sm:col-span-6 md:col-span-3">
          <div class="flex flex-row bg-white shadow-sm rounded p-4">
            <div class="flex flex-col flex-grow ">
              <div class="text-sm text-gray-500">Current Riddle</div>
              <p class="m-auto font-bold text-lg" v-if="result?.player?.targetEgg?.riddle">{{ result.player.targetEgg.riddle }}</p>
              <p class="m-auto font-bold text-lg" v-if="result">You don't currently have a riddle go help other's catch up!</p>
            </div>
          </div>
        </div>

      </div>
      <div class="mt-2">
        <div class="col-span-12 sm:col-span-6 md:col-span-3">
          <div class="flex flex-row bg-white shadow-sm rounded p-4">
            <div class="flex flex-col flex-grow ">
              <div class="text-sm text-gray-500">Your Eggs Collected</div>
              <p class="m-auto fond-bold text-lg" v-if="result?.player?.eggsCollected !== undefined">{{ result.player.eggsCollected }}</p>
            </div>
          </div>
        </div>

      </div>
      <div class="mt-2">
        <div class="col-span-12 sm:col-span-6 md:col-span-3">
          <div class="flex flex-row bg-white shadow-sm rounded p-4">
            <div class="flex flex-col flex-grow ">
              <div class="text-sm text-gray-500">Total Eggs Collected</div>
              <p class="m-auto fond-bold text-lg" v-if="result?.eggHunt?.eggsFound !== undefined">{{ result?.eggHunt?.eggsFound }}</p>
            </div>
          </div>
        </div>

      </div>
      <div class="mt-2">
        <div class="col-span-12 sm:col-span-6 md:col-span-3">
          <div class="flex flex-row bg-white shadow-sm rounded p-4">
            <div class="flex flex-col flex-grow ">
              <div class="text-sm text-gray-500">Total Eggs Left</div>
              <p class="m-auto fond-bold text-lg" v-if="result?.eggHunt?.eggsLeft !== undefined">{{ result?.eggHunt?.eggsLeft }}</p>
            </div>
          </div>
        </div>

      </div>
      <div class="mt-2">
        <div class="col-span-12 sm:col-span-6 md:col-span-3">
          <div class="flex flex-row bg-white shadow-sm rounded p-4">
            <div class="flex flex-col flex-grow ">
              <div class="text-sm text-gray-500">Status</div>
              <p class="m-auto fond-bold text-lg" v-if="result?.eggHunt?.status !== undefined">{{ result?.eggHunt?.status }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import KonamiCode from "konami-code-js";
import {defineComponent, ref, onMounted, watch} from 'vue'
import QRCamera from '../components/QRCamera.vue'
import Swal from 'sweetalert2'
import {useQuery, useMutation} from '@vue/apollo-composable'
import gql from 'graphql-tag'
let showCamera = ref(false)
let manualOverride = ref('')
let scanning = ref(false)
let hint = ref('This is the default hint')
let userID = localStorage.getItem('userID')
let debug = ref(true)
async function submitEgg(){

  let egg = await findEgg({
    name: manualOverride.value,
    playerName: userID
  })
  manualOverride.value = ''
  await handleEgg(egg)
}
async function onDecode(data) {
  // scanning.value = false;
  let parsed;
  if (typeof data !== "object") {
    parsed = JSON.parse(data)
  } else {
    parsed = data
  }
  if (!parsed.eggID) {
    // not a valid egg swal
    await Swal.fire({
      title: 'Invalid QR Code',
      text: 'This is not a hint egg: ' + data,
      icon: 'result',
      confirmButtonText: 'OK'
    })
  }
  //get userid from storage
  let egg = await findEgg({
    eggId: parsed.eggID,
    playerName: userID
  })
  await handleEgg(egg)

}
async function handleEgg(egg){
  if (egg.data.findEgg === "INVALID_EGG") {
    await Swal.fire({
      title: 'Invalid Egg',
      text: 'This is an invalid egg',
      icon: 'result',
      confirmButtonText: 'OK'
    })
    return
  }
  if (egg.data.findEgg === "NOT_YOUR_EGG") {
    await Swal.fire({
      title: 'Not Your Egg',
      text: 'This is not your egg',
      icon: 'result',
      confirmButtonText: 'OK'
    })
    return
  }
  await Swal.fire({
    title: 'Egg Found',
    text: 'You found an egg!',
    icon: 'success',
    confirmButtonText: 'OK'
  })
  await refetch()
}

const {mutate: findEgg} = useMutation(gql`
      mutation ($eggId: String, $playerName: String!, $name: String) {
        findEgg(id: $eggId, playerName: $playerName, name: $name)
      }
    `)
//get name from local storage
const variables = ref({
  name: userID
})
const {result, loading, error, refetch} = useQuery(gql`
      query getPlayer($name: String!){
        player (name: $name){
          name
          eggsCollected
          targetEgg{
            name
            id
            riddle
          }

        }
        eggHunt {
          eggsFound
          eggsLeft
          status
        }
      }
    `, variables)
defineComponent({
  name: 'Home',
  components: {
    QRCamera,
  },
})
onMounted( () => {
  let kc = new KonamiCode({
    listener: document.getElementsByTagName("body")[0]
  });
kc.enableTouchGesture();
  kc.setCallback(function () {
    debug.value = !debug.value

    // Do something here.
    // This part will be executed if « Up Up Down Down Left Right Left Right B A »
    // is recognised from Keyboard or Touch Gesture.
  });
})
</script>
