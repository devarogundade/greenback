<template>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="4.5" :fill="props.active ? 'var(--primary)' : ''" />
        <circle cx="9" cy="9" r="8.25" :stroke="props.active ? 'var(--primary-light)' : 'var(--bg-darker)'"
            stroke-width="1.5" />
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    active: { type: Boolean }
});
</script>
