<template>
    <div class="w-full h-full select-none" v-bind="$attrs" :onmousedown="draggable ? onMouseDown : null">
        <div ref="previousContainer" />
        <div ref="currentContainer" />
        <div ref="nextContainer" />
    </div>
</template>

<script lang="ts" src="./Slider.ts" />

<style scoped lang="postcss" src="./Slider.pcss" />
