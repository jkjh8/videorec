import { defineStore } from 'pinia'
import { TouchSwipe } from 'quasar'

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

        this.meterDataL = new Float32Array(this.analyserL.frequencyBinCount)
        this.meterDataR = new Float32Array(this.analyserR.frequencyBinCount)
        console.log('audio api init')
        this.updateMeter()
      } catch (err) {
        console.error('Web Audio Api Error', err)
      }
    },
    updateMeter() {
      requestAnimationFrame(this.updateMeter)
      this.analyserL.getFloatTimeDomainData(this.meterDataL)
      this.analyserR.getFloatTimeDomainData(this.meterDataR)
      this.meterL = 0
      this.meterR = 0

      for (let i = 0; i < this.meterDataL.length; i++) {
        try {
          if (this.meterL < this.meterDataL[i]) {
            this.meterL = this.meterDataL[i]
          }
          if (this.meterR < this.meterDataR[i]) {
            this.meterR = this.meterDataR[i]
          }
        } catch (err) {
          console.error(err)
        }
      }
      // console.log('level', this.meterL, this.meterR)
    }
  }
})
