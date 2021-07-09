<template>
    <div class="w-full h-full">
        <div ref="mainImage" v-bind="$attrs" :onmousedown="draggable ? onMouseDown : null" />
    </div>
</template>

<script lang="ts" src="./Slider.ts" />

<style scoped lang="postcss" src="./Slider.pcss" />
