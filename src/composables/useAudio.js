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

function checkLevel(arr) {
  let rv = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      if (arr[i] > 128) {
        rv = arr[i] % 128
      } else {
        rv = 128 - arr[i]
      }
    }
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

    if (levelL > 126) {
      if (peakIntervalL) {
        clearTimeout(peakIntervalL)
      }
      setPeak('L')
    }

    if (levelR > 126) {
      if (peakIntervalR) {
        clearTimeout(peakIntervalR)
      }
      setPeak('R')
    }

    smoothLevelL = 0.9 * smoothLevelL + 0.1 * levelL
    smoothLevelR = 0.9 * smoothLevelR + 0.1 * levelR
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
  peakL,
  peakR,
  setAudioMeter,
  meterWidth,
  setMeterWidth
}
