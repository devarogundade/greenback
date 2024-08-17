<template>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14.925 8.93341H12.35V2.93341C12.35 1.53341 11.5917 1.25008 10.6667 2.30008L10 3.05841L4.35834 9.47508C3.58334 10.3501 3.90834 11.0667 5.07501 11.0667H7.65001V17.0667C7.65001 18.4667 8.40834 18.7501 9.33334 17.7001L10 16.9417L15.6417 10.5251C16.4167 9.65008 16.0917 8.93341 14.925 8.93341Z"
            :fill="props.color || '#C5E86C'" />
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    color: { type: String, required: false }
});
</script>