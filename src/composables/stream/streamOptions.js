export const resolutions = [
  { label: 'Auto', value: 'auto' },
  {
    label: '720 30p',
    value: { width: 1280, height: 720, framerate: 30 }
  },
  {
    label: '720 60p',
    value: { width: 1290, height: 720, framerate: 60 }
  },
  {
    label: '1080 30p',
    value: { width: 1920, height: 1080, framerate: 30 }
  },
  {
    label: '1080 60p',
    value: { width: 1920, height: 1080, framerate: 60 }
  },
  {
    label: '1440 30p',
    value: { width: 2560, height: 1440, framerate: 30 }
  },
  {
    label: '1440 60p',
    value: { width: 2560, height: 1440, framerate: 60 }
  },
  {
    label: '2160 30p',
    value: { width: 3840, height: 2160, framerate: 30 }
  },
  {
    label: '2160 60p',
    value: { width: 3840, height: 2160, framerate: 60 }
  }
]

export const audioOptions = {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
  volume: 1,
  channelCount: 2
}
