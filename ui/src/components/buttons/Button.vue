<script setup lang="ts">
const props = defineProps({
    text: { type: String, require: true },
    loading: { type: Boolean },
    disable: { type: Boolean }
});
</script>

<template>
    <button :disabled="disable">
        <p class="text">{{ props.text }}</p>
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    height: 40px;
    border-radius: 6px;
    background: var(--primary);
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: .2s;
    gap: 10px;
}

button:hover {
    opacity: 0.8;
}

button:disabled {
    cursor: not-allowed;
}

.text {
    color: var(--bg);
    font-size: 14px;
    font-weight: 500;
}
</style>