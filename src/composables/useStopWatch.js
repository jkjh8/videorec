import { ref } from 'vue'
import moment from 'moment'

let clock = ref(moment())
let start = ref(moment())
let second = ref(0)
let showTime = ref('00:00:00')
let status = ref(false)
let remaind = ref(0)
let remaindTime = ref('00:00:00')

function toggleStart() {
  if (status.value) {
    status.value = false
  } else {
    if (!second.value) {
      start.value = moment()
      second.value = 0
      remaind.value = 0
    }
    status.value = true
  }
}

function fnStop() {
  status.value = false
  second.value = 0
  remaind.value = 0
  remaindTime.value = '00:00:00'
}

setInterval(() => {
  clock.value = moment()
  let hours, minutes, seconds
  if (status.value) {
    second.value = second.value + 1
    hours =
      parseInt(second.value / 3600) < 10
        ? `0${parseInt(second.value / 3600)}`
        : parseInt(second.value / 3600)
    minutes =
      parseInt((second.value % 3600) / 60) < 10
        ? `0${parseInt((second.value % 3600) / 60)}`
        : parseInt((second.value % 3600) / 60)
    seconds =
      parseInt(second.value % 60) < 10
        ? `0${parseInt(second.value % 60)}`
        : parseInt(second.value % 60)
    showTime.value = `${hours}:${minutes}:${seconds}`
    // console.log(showTime.value)
  }
  if (remaind.value) {
    remaind.value = remaind.value + 1
    hours =
      parseInt(remaind.value / 3600) < 10
        ? `0${parseInt(remaind.value / 3600)}`
        : parseInt(remaind.value / 3600)
    minutes =
      parseInt((remaind.value % 3600) / 60) < 10
        ? `0${parseInt((remaind.value % 3600) / 60)}`
        : parseInt((remaind.value % 3600) / 60)
    seconds =
      parseInt(remaind.value % 60) < 10
        ? `0${parseInt(remaind.value % 60)}`
        : parseInt(remaind.value % 60)
    remaindTime.value = `${hours}:${minutes}:${seconds}`
    // console.log(showTime.value)
  }
}, 1000)

export {
  clock,
  toggleStart,
  showTime,
  start,
  status,
  second,
  fnStop,
  remaind,
  remaindTime
}
