import { ref } from 'vue'

const ac = new AudioContext(),
  source = ref(null),
  meterL = ref(null),
  meterR = ref(null),
  levelL = ref(0),
  levelR = ref(0),
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
  peakIntervalR,
  levelDbL,
  levelDbR

function initAudio(stream) {
  try {
    source.value = ac.createMediaStreamSource(stream)
    analyserL = ac.createAnalyser()
    analyserR = ac.createAnalyser()

    const spliter = ac.createChannelSplitter(2)

    source.value.connect(spliter)
    spliter.connect(analyserL, 0)
    spliter.connect(analyserR, 1)

    meterDataL = new Float32Array(analyserL.fftSize)
    meterDataR = new Float32Array(analyserR.fftSize)

    ctxL = meterL.value.getContext('2d')
    ctxR = meterR.value.getContext('2d')
    // setInterval(() => drawMeter(), 500)
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
    analyserL.getFloatTimeDomainData(meterDataL)
    analyserL.getFloatTimeDomainData(meterDataR)

    // console.log(Math.max(meterDataL))

    for (let i = 0; i < meterDataL.length; i++) {
      const powerL = meterDataL[i] ** 2
      levelL.value = Math.max(powerL, meterDataL[i])

      const powerR = meterDataR[i] ** 2
      levelR.value = Math.max(powerR, meterDataR[i])
    }

    if (10 * Math.log10(levelL.value) > -2) {
      if (peakIntervalL) {
        clearTimeout(peakIntervalL)
      }
      setPeak('L')
    }

    if (10 * Math.log10(levelR.value) > -2) {
      if (peakIntervalR) {
        clearTimeout(peakIntervalR)
      }
      setPeak('R')
    }

    smoothLevelL = 0.9 * smoothLevelL + 0.1 * levelL.value
    smoothLevelR = 0.9 * smoothLevelR + 0.1 * levelR.value
    levelDbL = 10 * Math.log10(smoothLevelL)
    levelDbR = 10 * Math.log10(smoothLevelR)

    if (smoothLevelL > -3) {
      ctxL.fillStyle = '#1976d2'
    } else if (smoothLevelL <= -3 && smoothLevelL > -6) {
      ctxL.fillStyle = 'yellow'
    } else {
      ctxL.fillStyle = '#1976d2'
    }
    if (smoothLevelR > -3) {
      ctxR.fillStyle = '#1976d2'
    } else if (smoothLevelR <= -3 && smoothLevelR > -6) {
      ctxR.fillStyle = 'yellow'
    } else {
      ctxR.fillStyle = '#1976d2'
    }

    // canvasMeterL = meterL.value.width * levelL.value
    // canvasMeterR = meterR.value.width * levelR.value

    ctxL.fillRect(
      0,
      0,
      meterL.value.width + (meterL.value.width / 100) * levelDbL,
      meterL.value.height
    )
    ctxR.fillRect(
      0,
      0,
      meterR.value.width + (meterR.value.width / 100) * levelDbR,
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
export {
  meterL,
  meterR,
  levelL,
  levelR,
  peakL,
  peakR,
  initAudio,
  meterWidth
}
