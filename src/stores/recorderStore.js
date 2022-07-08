import { defineStore } from 'pinia'

export const useRecorderStore = defineStore('recorder', {
  state: () => ({
    counter: 0,
    contentTypes: [
      'video/webm',
      'video/webm;codecs=vp8',
      'video/webm;codecs=vp9',
      'video/x-matroska;codecs=avc1',
      // "audio/webm",
      'video/ogg',
      'video/mkv',
      'video/quicktime',
      'video/mp4',
      'video/mp4;codecs=avc1',
      'video/mp4;codecs=avc1.4d002a',
      'video/invalid'
    ],
    supportedTypes: [],
    recorder: null,
    state: ''
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    chkSupportedTypes() {
      this.supportedTypes = []
      if (MediaRecorder == undefined) {
        console.error('Media Recorder not supported')
      } else {
        this.contentTypes.forEach((type) => {
          if (MediaRecorder.isTypeSupported(type)) {
            this.supportedTypes.push(type)
          }
        })
      }
      console.log(this.supportedTypes)
    },
    async init(stream, options) {
      this.recorder = new MediaRecorder(stream, options)

      this.recorder.ondataavailable = async (d) => {
        API.send('rec:data', await d.data.arrayBuffer())
      }

      this.recorder.onerror = (e) => {
        console.error(`error recording stream: ${e.error.name}`)
      }

      this.recorder.onpause = (e) => {
        console.log('pause recording stream')
      }

      this.recorder.onresume = (e) => {
        console.log('resume recording stream')
      }

      this.recorder.onstart = (e) => {
        console.log('start recording stream')
      }

      this.recorder.onstop = (e) => {
        console.log('stop recording stream')
      }
      this.getState()
    },
    getState() {
      this.state = this.recorder.state
      console.log(this.state)
    },
    start() {
      API.send('rec:start')
      this.recorder.start(1000)
      this.getState()
    },
    end() {
      this.recorder.stop()
      API.send('rec:stop')
      this.getState()
    }
  }
})
