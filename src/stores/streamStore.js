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
        console.error('Not found Devices', err)
      }
    },
    async startStream() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
})
