import { ref, computed } from 'vue'
import { stream, startStream, stopStream } from './useStream'
import { setAudioMeter } from './useAudio'
import { setVideo } from './useVideo'

const contentTypes = [
  'video/webm',
  'video/webm;codecs=vp8',
  'video/webm;codecs=vp9',
  'video/ogg',
  'video/mkv',
  'video/quicktime',
  'video/mp4',
  'video/invalid'
]

const qualitys = [
  { label: '500k', value: 500000 },
  { label: '1.5M', value: 1500000 },
  { label: '2.5M', value: 2500000 },
  { label: '3M', value: 3000000 },
  { label: '4M', value: 4000000 },
  { label: '8M', value: 8000000 },
  { label: '15M', value: 15000000 },
  { label: '20M', value: 20000000 },
  { label: '25M', value: 25000000 },
  { label: '40M', value: 40000000 }
]

const recorder = ref(null)
const supportedTypes = ref([])
const format = ref('video/webm;codecs=vp9')
const quality = ref(2500000)
const recState = ref('')
const recTime = ref(0)
const recTimeString = computed(() => {
  return `${parseInt(recTime.value) / 3600 < 10 ? '0' : ''}${
    parseInt(recTime.value) / 3600
  }:${parseInt(recTime.value / 3600 / 60) < 10 ? '0' : ''}${parseInt(
    recTime.value / 3600 / 60
  )}:${parseInt(recTime.value % 60) < 10 ? '0' : ''}${parseInt(
    recTime.value % 60
  )}`
})

function checkSupportedTypes() {
  supportedTypes.value = []
  try {
    contentTypes.forEach((type) => {
      if (MediaRecorder.isTypeSupported(type)) {
        supportedTypes.value.push(type)
      }
    })
  } catch (e) {
    console.error(e)
  }
  console.log(supportedTypes.value)
}

function setRecorder(stream) {
  recorder.value = new MediaRecorder(stream.value, {
    videoBitsPerSecond: quality.value
  })

  recorder.value.ondataavailable = async (d) => {
    API.send('rec:data', await d.data.arrayBuffer())
    recTime.value = recTime.value + 0.1
  }

  recorder.value.onerror = (e) => {
    updateRecorderState()
    console.error(`error recording stream: ${e.error.name}`)
  }

  recorder.value.onpause = (e) => {
    updateRecorderState()
  }

  recorder.value.onresume = (e) => {
    updateRecorderState()
  }

  recorder.value.onstart = (e) => {
    updateRecorderState()
  }

  recorder.value.onstop = (e) => {
    updateRecorderState()
  }
  updateRecorderState()
}

function updateRecorderState() {
  recState.value = recorder.value.state
}

function recStart() {
  recTime.value = 0
  API.send('rec:start')
  recorder.value.start(100)
}

function recStop() {
  recorder.value.stop()
  API.send('rec:stop')
}

async function setStreamRecorder() {
  try {
    if (stream.value) {
      await stopStream()
    }
    await startStream()
    setRecorder()
    setVideo()
    setAudioMeter()
  } catch (err) {
    throw err
  }
}

export {
  recorder,
  format,
  qualitys,
  quality,
  recState,
  checkSupportedTypes,
  supportedTypes,
  setRecorder,
  updateRecorderState,
  recStart,
  recStop,
  recTimeString,
  setStreamRecorder
}
