import { ref } from 'vue'
import { stream } from './useStream'
import { resolution } from './useStream'

const video = ref(null)
const audioMute = ref(false)

function setVideo() {
  if (!video.value.paused) {
    video.value.pause()
  }
  video.value.srcObject = stream.value
  video.value.load()
  video.value.play()
  video.value.muted = audioMute.value
}

async function setAudioMute() {
  audioMute.value = !audioMute.value
  video.value.muted = audioMute.value
  await API.send('setup:update', [
    { key: 'audiomute', value: audioMute.value }
  ])
}

function windowResize() {
  API.send('status:resize', video.value.clientHeight)
}

function setWindowSize() {
  if (resolution.value !== 'auto') {
    API.send('status:setSize', { ...resolution.value })
  }
}
export {
  audioMute,
  video,
  setVideo,
  setAudioMute,
  windowResize,
  setWindowSize
}
