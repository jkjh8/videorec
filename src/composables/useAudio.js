import { ref } from 'vue'
import { stream } from './useStream'

const ac = new AudioContext(),
  source = ref(null),
  meterL = ref(null),
  meterR = ref(null),
  peakL = ref(false),
  peakR = ref(false),
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
    analyserL.minDecibels = -100
    analyserL.maxDecibels = -30
    analyserR.minDecibels = -100
    analyserR.maxDecibels = -30

    const spliter = ac.createChannelSplitter(2)

    source.value.connect(spliter)
    spliter.connect(analyserL, 0)
    spliter.connect(analyserR, 1)

    meterDataL = new Uint8Array(analyserL.frequencyBinCount)
    meterDataR = new Uint8Array(analyserR.frequencyBinCount)

    ctxL = meterL.value.getContext('2d')
    ctxR = meterR.value.getContext('2d')

    drawMeter()
  } catch (err) {
    console.error('init error ', err)
  }
}

function checkLevel(arr) {
  let rv = 0
  for (let i = 0; i < arr.length; i++) {
    rv = Math.max(rv, arr[i])
  }
  return rv
}

function drawMeter() {
  try {
    requestAnimationFrame(drawMeter)
    ctxL.clearRect(0, 0, meterL.value.width, meterL.value.height)
    ctxR.clearRect(0, 0, meterR.value.width, meterR.value.height)
    analyserL.getByteFrequencyData(meterDataL)
    analyserR.getByteFrequencyData(meterDataR)

    const levelL = checkLevel(meterDataL)
    const levelR = checkLevel(meterDataR)

    if (levelL > 254) {
      if (peakIntervalL) {
        clearTimeout(peakIntervalL)
      }
      setPeak('L')
    }

    if (levelR > 254) {
      if (peakIntervalR) {
        clearTimeout(peakIntervalR)
      }
      setPeak('R')
    }

    smoothLevelL = 0.85 * smoothLevelL + 0.15 * levelL
    smoothLevelR = 0.85 * smoothLevelR + 0.15 * levelR
    ctxL.fillStyle = '#1976d2'
    ctxR.fillStyle = '#1976d2'

    ctxL.fillRect(
      0,
      0,
      (meterL.value.width / 255) * smoothLevelL,
      meterL.value.height
    )
    ctxR.fillRect(
      0,
      0,
      (meterR.value.width / 255) * smoothLevelR,
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
  peakL,
  peakR,
  setAudioMeter,
  meterWidth,
  setMeterWidth
}
