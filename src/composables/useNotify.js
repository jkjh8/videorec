import { useQuasar } from 'quasar'

export default function () {
  const $q = useQuasar()
  return {
    info: (msg, caption) => {
      $q.notify({
        icon: 'info',
        color: 'primary',
        position: 'top',
        message: msg,
        caption: caption ?? '',
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
        color: 'negative',
        position: 'top',
        message: msg,
        caption: caption ?? '',
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
