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
    state: '',
    selectedFormat: '',
    quality: 2610000,
    qualitys: [
      { label: '500k', value: 500000 },
      { label: '1.5M', value: 1500000 },
      { label: '2.5M', value: 2610000 },
      { label: '4.5M', value: 4500000 },
      { label: '8M', value: 8700000 },
      { label: '15M', value: 15000000 },
      { label: '20M', value: 20000000 },
      { label: '25M', value: 25000000 },
      { label: '40M', value: 40000000 }
    ]
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
    },
    async init(stream) {
      this.recorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: this.quality
      })
      console.log(this.recorder)

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
