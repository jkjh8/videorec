import { ref, computed } from 'vue'
import { stream, startStream, stopStream } from './useStream'
import { setAudioMeter } from './useAudio'
import { setVideo } from './useVideo'
import { contentTypes, qualitys } from './recorder/recorderOptions'

const recorder = ref(null)
const supportedTypes = ref([])
const format = ref('video/webm;codecs=vp9')
const quality = ref(2500000)
const recState = ref('')
const recTime = ref(0)
const recTimeString = computed(() => {
  return `${parseInt(recTime.value / 3600) < 10 ? '0' : ''}${parseInt(
    recTime.value / 3600
  )}:${
    parseInt((recTime.value / 3600) % 60) < 10 ? '0' : ''
  }${parseInt((recTime.value / 3600) % 60)}:${
    parseInt(recTime.value % 60) < 10 ? '0' : ''
  }${parseInt(recTime.value % 60)}`
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
}

function setRecorder() {
  recorder.value = new MediaRecorder(stream.value, {
    mimeType: format.value,
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
  API.send('rec:start', { format, quality })
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

function recStartStop() {
  if (recState.value !== 'recording') {
    recStart()
  } else {
    recStop()
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
  setStreamRecorder,
  recStartStop
}
