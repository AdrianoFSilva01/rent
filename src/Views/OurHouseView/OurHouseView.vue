<template>
    <div class="space-y-10">
        <ImageSlideshow class="w-96 m-4" :images="images" v-in-viewport="'fade-animation'" />
        <ImageReveal class="w-auto h-180 mx-20" :images="renovationImages" v-in-viewport="'fade-animation'" />
    </div>
</template>

<script lang="ts" src="./OurHouseView.ts" />

<style scoped lang="postcss" src="./OurHouseView.pcss" />