import { ref, computed } from 'vue'
import { stream } from './useStream'
import { qualitys } from './recorder/recorderOptions'
import { error } from './useStatus'
import fixWebmDuration from 'webm-duration-fix'
import { Buffer } from 'buffer'
import { useQuasar } from 'quasar'
global.Buffer = Buffer

let blobSlice = []
const time = ref(0)
let currentTime = 0
const recorder = ref(null)
const format = ref('video/webm')
const quality = ref(4000000)
const recState = ref('')

const clockString = computed(() => {
  let sec = parseInt(time.value / 1000)
  const h = parseInt(sec / 3600)
    .toString()
    .padStart(2, '0')
  const m = parseInt((sec % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const s = parseInt(sec % 60)
    .toString()
    .padStart(2, '0')
  return h + ':' + m + ':' + s
})

function setRecorder() {
  return new Promise((resolve, reject) => {
    try {
      time.value = 0
      currentTime = 0

      recorder.value = new MediaRecorder(stream.value, {
        mimeType: format.value,
        videoBitsPerSecond: quality.value ?? 4000000,
        audioBitsPerSecond: 128000
      })

      recorder.value.ondataavailable = async (d) => {
        if (currentTime) {
          time.value = time.value + d.timeStamp - currentTime
        }
        currentTime = d.timeStamp
        blobSlice.push(d.data)
        API.send('rec:data', {
          buffer: await d.data.arrayBuffer(),
          time: time.value
        })
      }

      recorder.value.onerror = (e) => {
        updateRecorderState()
        console.error(`error recording stream: ${e.error.name}`)
      }

      recorder.value.onstart = (e) => {
        updateRecorderState()
      }

      recorder.value.onstop = async (e) => {
        API.send('file:start')
        const fixBlob = await fixWebmDuration(
          new Blob([...blobSlice], { type: format.value })
        )
        const blobReadstream = fixBlob.stream()
        const blobReader = blobReadstream.getReader()

        while (true) {
          let { done, value } = await blobReader.read()
          if (done) {
            console.log('write done.')
            API.send('file:stop')
            break
          }
          API.send('file:data', value)
          value = null
        }
        blobSlice = []
        updateRecorderState()
      }
      resolve(updateRecorderState())
    } catch (err) {
      reject(err)
    }
  })
}

function updateRecorderState() {
  recState.value = recorder.value.state
  return recState.value
}

async function recStart() {
  recState.value = await setRecorder()
  await API.send('rec:start')
  recorder.value.start(100)
}

function recStop() {
  recorder.value.stop()
  API.send('rec:stop')
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
  setRecorder,
  updateRecorderState,
  recStart,
  recStop,
  recStartStop,
  clockString
}
