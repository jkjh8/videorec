import { ref } from 'vue'
import { stream } from './useStream'

const ac = new AudioContext(),
  source = ref(null),
  meterL = ref(null),
  meterR = ref(null),
  levelL = ref(0),
  levelR = ref(0),
  peakL = ref(false),
  peakR = ref(false),
  levelDbL = ref(0),
  levelDbR = ref(0),
  meterWidth = ref(window.innerWidth - 10)

let smoothLevelL = 0,
  smoothLevelR = 0,
  meterDataL,
  meterDataR,
  ctxL,
  ctxR,
  analyserL,
  analyserR,
  peakIntervalL,
  peakIntervalR

function setAudioMeter() {
  try {
    source.value = ac.createMediaStreamSource(stream.value)
    analyserL = ac.createAnalyser()
    analyserR = ac.createAnalyser()
    // analyserL.fftSize = 64
    // analyserR.fftSize = 64

    const spliter = ac.createChannelSplitter(2)

    source.value.connect(spliter)
    spliter.connect(analyserL, 0)
    spliter.connect(analyserR, 1)

    meterDataL = new Uint8Array(analyserL.fftSize)
    meterDataR = new Uint8Array(analyserR.fftSize)

    ctxL = meterL.value.getContext('2d')
    ctxR = meterR.value.getContext('2d')
    drawMeter()
  } catch (err) {
    console.error('init error ', err)
  }
}

function drawMeter() {
  try {
    requestAnimationFrame(drawMeter)
    ctxL.clearRect(0, 0, meterL.value.width, meterL.value.height)
    ctxR.clearRect(0, 0, meterR.value.width, meterR.value.height)
    levelL.value = 0
    levelR.value = 0
    analyserL.getByteFrequencyData(meterDataL)
    analyserR.getByteFrequencyData(meterDataR)

    // console.log(Math.max(meterDataL))

    for (let i = 0; i < meterDataL.length; i++) {
      let powerL, powerR
      if (meterDataL[i] !== 0) {
        if (meterDataL[i] > 128) {
          powerL = meterDataL[i] % 128
        } else {
          powerL = 128 - meterDataL[i]
        }
        levelL.value = Math.max(levelL.value, powerL)
      }
      if (meterDataR[i] !== 0) {
        if (meterDataR[i] > 128) {
          powerR = meterDataR[i] % 128
        } else {
          powerR = 128 - meterDataR[i]
        }
        levelR.value = Math.max(levelR.value, powerR)
      }
    }
    console.log(levelL.value)
    if (levelL.value > 125) {
      if (peakIntervalL) {
        clearTimeout(peakIntervalL)
      }
      setPeak('L')
    }

    if (levelR.value > 125) {
      if (peakIntervalR) {
        clearTimeout(peakIntervalR)
      }
      setPeak('R')
    }

    smoothLevelL = 0.9 * smoothLevelL + 0.1 * levelL.value
    smoothLevelR = 0.9 * smoothLevelR + 0.1 * levelR.value
    ctxL.fillStyle = '#1976d2'
    ctxR.fillStyle = '#1976d2'

    ctxL.fillRect(
      0,
      0,
      (meterL.value.width / 128) * smoothLevelL,
      meterL.value.height
    )
    ctxR.fillRect(
      0,
      0,
      (meterR.value.width / 128) * smoothLevelR,
      meterR.value.height
    )
  } catch (err) {
    console.error('data update', err)
  }
}

function setPeak(ch) {
  if (ch === 'L') {
    peakL.value = true
    peakIntervalL = setTimeout(() => {
      peakL.value = false
    }, 1000)
  } else {
    peakR.value = true
    peakIntervalR = setTimeout(() => {
      peakR.value = false
    }, 1000)
  }
}

function setMeterWidth() {
  meterWidth.value = window.innerWidth - 10
}
export {
  meterL,
  meterR,
  levelL,
  levelR,
  peakL,
  peakR,
  levelDbL,
  levelDbR,
  setAudioMeter,
  meterWidth,
  setMeterWidth
}
