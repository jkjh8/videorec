<script setup>
const props = defineProps({
  msg: String
})
</script>

<template>
  <q-tooltip
    style="background: rgba(0, 0, 0, 0.8)"
    anchor="top middle"
    self="bottom middle"
    :offset="[10, 10]"
  >
    {{ props.msg }}
  </q-tooltip>
</template>
