<template>
    <transition name="fade" @after-leave="transitionEnded = true">
        <img class="absolute top-0 transition duration-2000 opacity-100 object-cover h-full w-full" :src="image" :key="image" />
    </transition>
</template>

<script lang="ts" src="./Carousel.ts" />

<style scoped lang="postcss" src="./Carousel.pcss" />