import { ref, computed } from 'vue'
import { stream, startStream, stopStream } from './useStream'
import { setAudioMeter } from './useAudio'
import { setVideo } from './useVideo'
import { contentTypes, qualitys } from './recorder/recorderOptions'

const recorder = ref(null)
const supportedTypes = ref([])
const format = ref('video/webm')
const quality = ref(2500000)
const recState = ref('')

let startTime = moment()
const recTimeString = ref('00:00:00')
function curculeTime() {
  const time = moment.duration(moment().diff(startTime)).asSeconds()
  recTimeString.value = `${parseInt(time / 3600).padStart(
    2,
    '0'
  )}:${parseInt((time % 3600) / 60).padStart(2, '0')}:${parseInt(
    time % 60
  ).padStart(2, '0')}`
}

function stopTimer() {
  clearInterval(timer)
}

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
    videoBitsPerSecond: quality.value,
    audioBitsPerSecond: 128000
  })

  recorder.value.ondataavailable = async (d) => {
    API.send('rec:data', await d.data.arrayBuffer())
    curculeTime()
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
  startTime = moment()
  API.send('rec:start', {
    format,
    quality
  })
  recorder.value.start(500)
}

function recStop() {
  stopTimer()
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
