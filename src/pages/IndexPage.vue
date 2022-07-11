<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import { useRecorderStore } from 'src/stores/recorderStore'
import { useStreamStore } from 'src/stores/streamStore'
import { useAudioStore } from 'src/stores/audioStore'
import { video, refreshVideo } from 'src/composables/useVideo'
import { error } from 'src/composables/useError'

const $stream = useStreamStore()
const $rec = useRecorderStore()
const $audio = useAudioStore()
const $q = useQuasar()

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

onMounted(async () => {
  $q.loading.show()
  try {
    $rec.chkSupportedTypes()
    await $stream.getDevices()
    error.value = await $stream.startStream()
    if (!error.value) {
      refreshVideo($stream.stream)
      await $rec.init($stream.stream)
      await $audio.init($stream.stream)
    }
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    console.log(err)
  }
})

onBeforeMount(async () => {
  const items = await API.send('setup:get')
  console.log(items)
  items.forEach((item) => {
    switch (item.key) {
      case 'format':
        $rec.selectedFormat = item.value
        break
      case 'videodeivce':
        $stream.videoDevice = item.value
        console.log('update')
        break
      case 'audiodevice':
        $stream.audioDevice = item.value
        break
      case 'resolution':
        $stream.resolution = item.value
        break
      case 'quality':
        $rec.quality = item.value
        break
    }
  })
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
