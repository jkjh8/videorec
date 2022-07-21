import { ref, computed } from 'vue'
import { stream, startStream, stopStream } from './useStream'
import { setAudioMeter } from './useAudio'
import { setVideo } from './useVideo'
import { contentTypes, qualitys } from './recorder/recorderOptions'
import { Buffer } from 'buffer'
import RecordRTC, {
  invokeSaveAsDialog,
  getSeekableBlob
} from 'recordrtc'

import { Decoder, Encoder, tools, Reader } from 'ts-ebml'

window.Buffer = Buffer

const readAsArrayBuffer = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.onerror = (ev) => {
      reject(ev.error)
    }
  })
}
const injectMetadata = (blob) => {
  const decoder = new Decoder()
  const reader = new Reader()
  reader.logging = false
  reader.drop_default_duration = false
  return readAsArrayBuffer(blob).then((buffer) => {
    const elms = decoder.decode(buffer)
    elms.forEach((elm) => {
      reader.read(elm)
    })
    reader.stop()
    const refinedMetadataBuf = tools.makeMetadataSeekable(
      reader.metadatas,
      reader.duration,
      reader.cues
    )
    const body = buffer.slice(reader.metadataSize)
    return new Blob([refinedMetadataBuf, body], { type: blob.type })
  })
}

let timer
let recorder = null
const supportedTypes = ref([])
const format = ref('video/webm')
const quality = ref(2500000)
const recState = ref('')
const recTime = ref(0)
const recTimeString = ref('00:00:00')
function startTimer() {
  recTime.value = 0
  timer = setInterval(() => {
    recTime.value++
    recTimeString.value = `${
      parseInt(recTime.value / 3600) < 10 ? '0' : ''
    }${parseInt(recTime.value / 3600)}:${
      parseInt((recTime.value % 3600) / 60) < 10 ? '0' : ''
    }${parseInt((recTime.value % 3600) / 60)}:${
      parseInt(recTime.value % 60) < 10 ? '0' : ''
    }${parseInt(recTime.value % 60)}`
  }, 1000)
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

async function setRecorder() {
  recorder = RecordRTC(stream.value, {
    type: 'video'
  })

  recorder.ondataavailable = async (d) => {
    API.send('rec:data', await d.data.arrayBuffer())
  }

  recorder.onerror = (e) => {
    console.error(`error recording stream: ${e.error.name}`)
  }

  recorder.onStateChanged = (state) => {
    console.log('!!!!!!!!!!!!', state)
    recState.value = state
  }

  recorder.onpause = (e) => {}

  recorder.onresume = (e) => {}

  recorder.onstart = (e) => {}

  recorder.onstop = (e) => {}
}

async function recStart() {
  startTimer()
  recState.value = 'recording'
  // API.send('rec:start', {
  //   format,
  //   quality
  // })
  recorder.startRecording()
}

async function recStop() {
  stopTimer()
  await recorder.stopRecording(() => {
    let blob = recorder.getBlob()
    console.log(blob)
    injectMetadata(blob).then(async (sb) => {
      console.log(sb)
      API.send('rec:data', await sb.arrayBuffer())
    })
  })
  // setTimeout(() => {
  //   API.send('rec:stop')
  // }, 1000)
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
  recStart,
  recStop,
  recTimeString,
  setStreamRecorder,
  recStartStop
}
