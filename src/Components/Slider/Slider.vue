<template>
    <div>
        <transition name="fade" @after-leave="transitionEnded = true">
            <img class="absolute top-0 transition duration-2000 opacity-100 object-cover h-full w-full" :src="images[index]" :key="index" />
        </transition>
    </div>
</template>

<script lang="ts" src="./Slider.ts" />

<style scoped lang="postcss" src="./Slider.pcss" />