import { ref } from 'vue'

let videoDevices = []
let audioDevices = []
const resolutions = [
  { label: 'Auto', value: 'auto' },
  {
    label: '720 30p',
    value: { width: 1280, height: 720, framerate: 30 }
  },
  {
    label: '720 60p',
    value: { width: 1290, height: 720, framerate: 60 }
  },
  {
    label: '1080 30p',
    value: { width: 1920, height: 1080, framerate: 30 }
  },
  {
    label: '1080 60p',
    value: { width: 1920, height: 1080, framerate: 60 }
  },
  {
    label: '1440 30p',
    value: { width: 2560, height: 1440, framerate: 30 }
  },
  {
    label: '1440 60p',
    value: { width: 2560, height: 1440, framerate: 60 }
  },
  {
    label: '2160 30p',
    value: { width: 3840, height: 2160, framerate: 30 }
  },
  {
    label: '2160 60p',
    value: { width: 3840, height: 2160, framerate: 60 }
  }
]
const stream = ref(null)
const videoDevice = ref(null)
const audioDevice = ref(null)
const resolution = ref('auto')

async function getDevices() {
  videoDevices = []
  audioDevices = []
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    for (let i = 0; i < devices.length; i++) {
      switch (devices[i].kind) {
        case 'audioinput':
          audioDevices.push(devices[i])
          break
        case 'videoinput':
          videoDevices.push(devices[i])
          break
      }
    }
    return null
  } catch (err) {
    return 'err.name'
  }
}

function stopStream() {
  return new Promise(async (resolve, reject) => {
    try {
      if (stream.value) {
        const tracks = await stream.value.getTracks()
        if (tracks && tracks.length) {
          for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop()
          }
        }
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

async function startStream() {
  return new Promise(async (resolve, reject) => {
    try {
      // build options
      let options = {
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          audoGainControl: false,
          volume: 1,
          channelCount: 2
        }
      }

      if (videoDevice.value) {
        options.video = {
          deviceId: { exact: videoDevice.value }
        }
      }

      if (audioDevice.value) {
        options.audio.deviceId = { exact: audioDevice.value }
      }

      if (resolution.value !== 'auto') {
        options.video = {
          height: resolution.value.height,
          width: resolution.value.width,
          framRate: resolution.value.framerate
        }
        if (videoDevice.value) {
          options.video.deviceId = { exact: videoDevice.value }
        }
      }
      // get streams
      stream.value = await navigator.mediaDevices.getUserMedia(
        options
      )
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

function changeDevices() {
  navigator.mediaDevices.ondevicechange = () => {
    getDevices()
  }
}

export {
  stream,
  videoDevices,
  videoDevice,
  audioDevices,
  audioDevice,
  resolution,
  resolutions,
  getDevices,
  stopStream,
  startStream,
  changeDevices
}
