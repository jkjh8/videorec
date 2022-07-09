import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', {
  state: () => ({
    ac: new AudioContext(),
    source: null,
    analyserL: null,
    analyserR: null,
    meterDataL: null,
    meterDataR: null,
    meterL: 0,
    meterR: 0
  }),
  actions: {
    async init(stream) {
      try {
        this.source = this.ac.createMediaStreamSource(stream)
        this.analyserL = this.ac.createAnalyser()
        this.analyserR = this.ac.createAnalyser()

        const splitter = this.ac.createChannelSplitter(2)
        const merger = this.ac.createChannelMerger(2)
        const dest = this.ac.createMediaStreamDestination()

        this.source.connect(splitter)
        splitter.connect(this.analyserL, 0)
        splitter.connect(this.analyserR, 1)

        // this.analyserL.connect(merger, 0, 0)
        // this.analyserR.connect(merger, 0, 1)

        // merger.connect(dest)

        this.meterDataL = new Float32Array(analyserL.frequencyBinCount)
        this.meterDataR = new Float32Array(analyserR.frequencyB)
      } catch (err) {
        console.error('Web Audio Api Error', err)
      }
    },
    updateMeter() {
      this.analyserL.getFloatTimeDomainData(this.meterDataL)
      this.analyserR.getFloatTimeDomainData(this.meterDataR)
    }
  }
})
