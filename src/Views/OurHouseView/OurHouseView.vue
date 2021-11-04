<template>
    <div class="space-y-10">
        <ImageSlideshow class="w-96 m-4" :images="images" />
        <ImageReveal class="w-auto h-180 mx-20" :images="renovationImages" />
    </div>
</template>

<script lang="ts" src="./OurHouseView.ts" />

<style scoped lang="postcss" src="./OurHouseView.pcss" />