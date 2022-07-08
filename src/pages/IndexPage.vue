<script setup>
import { ref, onMounted } from 'vue'
import RecControls from 'components/recControls'
import { useRecorderStore } from 'src/stores/recorderStore'
import { useStreamStore } from 'src/stores/streamStore'

const $stream = useStreamStore()
const $rec = useRecorderStore()

const video = ref(null)

function setVideoMon() {
  video.value.srcObject = $stream.stream
  video.value.play()
  video.value.muted = true
}

onMounted(async () => {
  $rec.chkSupportedTypes()
  await $stream.getDevices()
  await $stream.startStream()
  await $rec.init($stream.stream)
  console.log($stream.stream)
  setVideoMon()

  const audioContext = new AudioContext()
  const mediaStreamSource = audioContext.createMediaStreamSource($stream.stream)
  const processor = audioContext.AudioWorkletProcessor(audioContext, 'vu-meter')
  mediaStreamSource.connect(processor)

  processor.onaudioProcess = function (e) {
    const inputData = e.inputBuffer.getChannelData(0)
    const inputDataLength = inputData.length
    const total = 0

    for (let i = 0; i < inputDataLength; i++) {
      total += Math.abs(inputData[i++])
    }

    const rms = Math.sqrt(total / inputDataLength)
    console.log(rms)
  }
})
</script>

<template>
  <div class="q-gutter-y-md" style="padding: 1%">
    <div class="row justify-center">
      <video ref="video" class="video" />
    </div>
    <RecControls />
  </div>
</template>

<style scoped>
.video {
  width: 100%;
  border-radius: 2px;
  background: #111;
}
</style>
