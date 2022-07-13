<script setup>
const props = defineProps({
  icon: String,
  color: String,
  msg: String,
  disable: Boolean
})
const emit = defineEmits(['click'])
</script>

<template>
  <q-btn
    flat
    round
    :disable="props.disable"
    :size="props.size ? props.size : 'md'"
    :color="props.color ? props.color : 'primary'"
    :icon="props.icon ? props.icon : ''"
    @click="emit('click')"
  >
    <q-tooltip
      style="background: rgba(0, 0, 0, 0.8)"
      anchor="top middle"
      self="bottom middle"
      :offset="[10, 10]"
    >
      {{ props.msg }}
    </q-tooltip>
  </q-btn>
</template>
