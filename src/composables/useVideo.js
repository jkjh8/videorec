import { ref } from 'vue'

const video = ref(null)
const audioMute = ref(false)

function refreshVideo(stream) {
  if (!video.value.paused) {
    video.value.pause()
  }
  video.value.srcObject = stream
  video.value.load()
  video.value.play()
  video.value.muted = audioMute.value
}

async function setAudioMute() {
  audioMute.value = !audioMute.value
  video.value.muted = audioMute.value
  await API.send('setup:update', [{ key: 'audiomute', value: audioMute.value }])
}

export { audioMute, video, refreshVideo, setAudioMute }
