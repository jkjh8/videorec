import { ref } from 'vue'

const video = ref(null)
const audioMute = ref(false)

function setVideo(stream) {
  if (!video.value.paused) {
    video.value.pause()
  }
  console.log(stream)
  video.value.srcObject = stream
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

export { audioMute, video, setVideo, setAudioMute, windowResize }
