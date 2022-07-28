import { useQuasar } from 'quasar'

export default () => {
  const $q = useQuasar()
  return {
    info: (msg, caption) => {
      $q.notify({
        icon: 'info',
        position: 'top',
        color: 'primary',
        message: msg,
        caption: caption,
        actions: [
          {
            icon: 'close',
            round: true,
            size: 'sm',
            color: 'grey-2',
            handler: () => {}
          }
        ]
      })
    },
    error: (msg, caption) => {
      $q.notify({
        icon: 'error',
        position: 'top',
        color: 'negative',
        message: msg,
        caption: caption,
        actions: [
          {
            icon: 'close',
            round: true,
            size: 'sm',
            color: 'grey-2',
            handler: () => {}
          }
        ]
      })
    }
  }
}
