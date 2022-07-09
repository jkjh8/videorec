<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRecorderStore } from 'src/stores/recorderStore'
import { useStreamStore } from 'src/stores/streamStore'
import { useAudioStore } from 'src/stores/audioStore'

const $stream = useStreamStore()
const $rec = useRecorderStore()
const $audio = useAudioStore()
const $q = useQuasar()

const error = ref(null)
const video = ref(null)

const audioContext = new AudioContext()
// navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
//   var source = new MediaStreamAudioSourceNode(audioContext, {
//     mediaStream: stream
//   })
//   var level,
//     smoothLevel = 0,
//     canvasMeter
//   let canvasContext = canvas.getContext('2d')
//   let analyser = audioContext.createAnalyser()
//   source.connect(analyser)
//   var data = new Float32Array(analyser.frequencyBinCount)
//   function draw() {
//     requestAnimationFrame(draw)
//     analyser.getFloatTimeDomainData(data) // get data for this sample
//     canvasContext.clearRect(0, 0, canvas.width, canvas.height)
//     level = 0
//     for (let i = 0; i < data.length; i++)
//       level += (5 * Math.abs(data[i])) / data.length
//     smoothLevel = 0.85 * smoothLevel + 0.15 * level
//     canvasMeter = canvas.height * (1 - smoothLevel) - 1
//     canvasContext.fillRect(1, canvasMeter, canvas.width, canvas.height)
//     console.log(smoothLevel)
//   }
//   draw()
// })

function setVideoMon() {
  video.value.srcObject = $stream.stream
  video.value.play()
  video.value.muted = true
}

onMounted(async () => {
  $rec.chkSupportedTypes()
  await $stream.getDevices()
  error.value = await $stream.startStream()
  if (!error.value) {
    await $rec.init($stream.stream)
    setVideoMon()
  }
})
</script>

<template>
  <div class="q-gutter-y-md" style="padding: 1% 1% 5% 1%">
    <div class="row justify-center">
      <video ref="video" class="video" />
    </div>
  </div>

  <div v-if="error" class="fixed-center">{{ error }}</div>
</template>

<style scoped>
.video {
  width: 100%;
  border-radius: 2px;
  background: #111;
}
</style>
