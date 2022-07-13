import { ref } from 'vue'

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
  recorder.value = new MediaRecorder(stream, {
    videoBitsPerSecond: quality.value
  })

  this.recorder.ondataavailable = async (d) => {
    API.send('rec:data', await d.data.arrayBuffer())
  }

  this.recorder.onerror = (e) => {
    updateRecorderState()
    console.error(`error recording stream: ${e.error.name}`)
  }

  this.recorder.onpause = (e) => {
    updateRecorderState()
  }

  this.recorder.onresume = (e) => {
    updateRecorderState()
  }

  this.recorder.onstart = (e) => {
    updateRecorderState()
  }

  this.recorder.onstop = (e) => {
    updateRecorderState()
  }
  updateRecorderState()
}

function updateRecorderState() {
  recState.value = recorder.value.state
}

function recStart() {
  API.send('rec:start')
  recorder.value.start(500)
}

function recStop() {
  recorder.value.stop()
  API.send('rec:stop')
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
  recStop
}
