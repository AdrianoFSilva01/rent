<template>
    <div class="relative">
        <div class="flex absolute h-full transform" :onmousedown="onMouseDown" @click="onClick">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" src="./Carousel.ts" />
