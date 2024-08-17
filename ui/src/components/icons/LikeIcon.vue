<template>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.23334 15.2916L8.81667 17.2916C9.15 17.6249 9.9 17.7916 10.4 17.7916H13.5667C14.5667 17.7916 15.65 17.0416 15.9 16.0416L17.9 9.95823C18.3167 8.79156 17.5667 7.79156 16.3167 7.79156H12.9833C12.4833 7.79156 12.0667 7.37489 12.15 6.79156L12.5667 4.12489C12.7333 3.37489 12.2333 2.54156 11.4833 2.29156C10.8167 2.04156 9.98334 2.37489 9.65 2.87489L6.23334 7.95823"
            :stroke="props.active ? 'var(--primary)' : 'var(--tx-dimmed)'" stroke-width="1.5" stroke-miterlimit="10" />
        <path
            d="M1.98334 15.2915V7.12484C1.98334 5.95817 2.48334 5.5415 3.65 5.5415H4.48334C5.65 5.5415 6.15 5.95817 6.15 7.12484V15.2915C6.15 16.4582 5.65 16.8748 4.48334 16.8748H3.65C2.48334 16.8748 1.98334 16.4582 1.98334 15.2915Z"
            :stroke="props.active ? 'var(--primary)' : 'var(--tx-dimmed)'" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    active: { type: Boolean, required: false }
});
</script>