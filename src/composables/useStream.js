import { ref } from 'vue'
import { resolutions } from './stream/streamOptions'

let videoDevices = []
let audioDevices = []
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
  } catch (err) {
    throw err
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
    } catch (err) {
      reject(err)
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
