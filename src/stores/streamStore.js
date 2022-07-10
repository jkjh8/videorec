import { defineStore } from 'pinia'

export const useStreamStore = defineStore('stream', {
  state: () => ({
    stream: null,
    streamOptions: {},
    videoDevices: [],
    audioDevices: [],
    selVideoDevice: null,
    selAudioDevice: null
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
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
        console.log('video', this.videoDevices, 'audio', this.audioDevices)
      } catch (err) {
        console.error('Start Stream Error = ', err)
      }
    },
    async startStream() {
      try {
        const options = {}
        if (this.selVideoDevice) {
          options.video.deviceId = this.selVideoDevice
        } else {
          options.video = true
        }
        if (this.selAudioDevice) {
          options.audio.deviceId = this.selAudioDevice
        } else {
          options.audio = true
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
