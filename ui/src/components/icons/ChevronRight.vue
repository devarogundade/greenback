<template>
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1.25 8.5L4.04289 5.70711C4.37623 5.37377 4.54289 5.20711 4.54289 5C4.54289 4.79289 4.37623 4.62623 4.04289 4.29289L1.25 1.5"
            :stroke="props.color || 'var(--bg)'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    color: { type: String, required: false }
});
</script>