<script setup lang="ts">
import { ref } from 'vue';
import { Chart, Marker, Area, Line } from 'vue3-charts';
import type { Direction, ChartAxis } from 'vue3-charts/src/types';

const props = defineProps({
    data: { type: Object },
    marker: { type: Boolean }
});

const direction = ref<Direction>('horizontal');
const margin = ref({
    left: 0,
    top: 20,
    right: 20,
    bottom: 0
});
const axis = ref<ChartAxis>({
    primary: {
        type: 'band',
        domain: ['dataMin', 'dataMax + 100'],
    },
    secondary: {
        domain: ['dataMin', 'dataMax + 100'],
        type: 'linear',
        ticks: 8,
        hide: true
    }
})

</script>

<template>
    <Chart :size="{ width: 800, height: 240 }" style="color: var(--tx-dimmed);" :data="(props.data as any)"
        :margin="margin" :direction="direction" :axis="axis">

        <template #layers>
            <Area :dataKeys="['name', 'pl']" type="monotone" :areaStyle="{ fill: 'url(#grad)' }" />

            <Line :dataKeys="['name', 'pl']" type="monotone" :lineStyle="{
                stroke: 'var(--bg-darkest)'
            }" />

            <Marker v-if="props.marker" :value="1000" label="Avg." color="var(--tx-dimmed)" :strokeWidth="1"
                strokeDasharray="6 6" />

            <defs>
                <linearGradient id="grad" gradientTransform="rotate(90)">
                    <stop offset="0%" stop-color="var(--tx-dimmed)" stop-opacity="1" />
                    <stop offset="100%" stop-color="var(--bg)" stop-opacity="0.4" />
                </linearGradient>
            </defs>
        </template>
    </Chart>
</template>