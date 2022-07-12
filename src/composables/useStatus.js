import { ref } from 'vue'

const disk = ref(null)
const folder = ref(null)

let diskChecker = ref(null)

function startDiskChkTimer() {
  diskChecker.value = setInterval(async () => {
    disk.value = await API.send('status:getdisk', folder.value)
  }, 60000)
}

function stopDiskChkTimer() {
  clearInterval(diskChecker.value)
  diskchecker.value = null
}

export { disk, folder, startDiskChkTimer, stopDiskChkTimer }
