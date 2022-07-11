import { defineStore } from 'pinia'

export const useStreamStore = defineStore('stream', {
  state: () => ({
    stream: null,
    streamOptions: {},
    videoDevices: [],
    audioDevices: [],
    videoDevice: null,
    audioDevice: null,
    resolution: null,
    resolutions: [
      { label: 'Auto', value: 'auto' },
      { label: '720 30p', value: { width: 1280, height: 720, framerate: 30 } },
      { label: '720 60p', value: { width: 1290, height: 720, framerate: 60 } },
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
      { label: '2160 60p', value: { width: 3840, height: 2160, framerate: 60 } }
    ]
  }),
  actions: {
    async getDevices() {
      this.videoDevices = []
      this.audioDevices = []
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        devices.forEach((d) => {
          switch (d.kind) {
            case 'audioinput':
              this.audioDevices.push(d)
              break
            case 'videoinput':
              this.videoDevices.push(d)
              break
          }
        })
      } catch (err) {
        console.error('Start Stream Error = ', err)
      }
    },
    async startStream() {
      try {
        if (this.stream) {
          this.stream.getTracks().forEach((track) => {
            track.stop()
          })
        }
        let options = { video: true, audio: true }
        if (this.videoDevice) {
          options.video = {
            deviceId: this.videoDevice
          }
        }
        if (this.audioDevice) {
          options.audio = { deviceId: this.audioDevice }
        }
        if (this.resolution !== 'auto') {
          options.video.height = this.resolution.height
          options.video.width = this.resolution.width
          options.video.frameRate = this.resolution.framerate
        }
        console.log(options)
        this.stream = await navigator.mediaDevices.getUserMedia(options)
        return null
      } catch (err) {
        console.error('Init Steram Error', err)
        return 'Device Not Found'
      }
    }
  }
})
