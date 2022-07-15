import { ref } from 'vue'
import { audioMute } from './useVideo'
import { format, quality } from './useRecorder'
import { videoDevice, audioDevice, resolution } from './useStream'

const disk = ref({ size: 0, free: 0 })
const folder = ref(null)
const error = ref('')
let diskusage

function startDiskChkTimer() {
  diskusage = setInterval(async () => {
    disk.value = await API.send('status:getdisk', folder.value)
  }, 60000)
}

function stopDiskChkTimer() {
  clearInterval(diskusage)
}

function APIHandler() {
  API.handle('status:state', (e, item) => {
    stateParser(item)
  })
}

function stateParser(item) {
  switch (item.key) {
    case 'format':
      format.value = item.value
      break
    case 'videodevice':
      videoDevice.value = item.value
      break
    case 'audiodevice':
      audioDevice.value = item.value
      break
    case 'resolution':
      resolution.value = item.value
      break
    case 'quality':
      quality.value = item.value
      break
    case 'audiomute':
      audioMute.value = item.value
      break
    case 'folder':
      folder.value = item.value
      break
    case 'disk':
      disk.value = item.value
      break
  }
}

async function getSetup() {
  const items = await API.send('setup:get')
  items.forEach((item) => {
    stateParser(item)
  })
}

async function selFolder() {
  const f = await API.send('status:selFolder')
  if (f) {
    folder.value = f
  }
}

async function openFolder() {
  API.send('status:openFolder', folder.value)
}

export {
  disk,
  error,
  folder,
  startDiskChkTimer,
  stopDiskChkTimer,
  APIHandler,
  getSetup,
  selFolder,
  openFolder
}
