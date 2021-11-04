<!-- prettier-ignore -->
<template>
    <div class="flex w-full items-center bg-white transition-all duration-300 -top-full z-20">
        <div class="flex-1 flex items-center space-x-10">
            <HamburgerMenu class="transform-opacity-animation" @click="displayOverlay" />
            <router-link to="/apartments" @click="backToTop">
                <UnderlineTextAnimated class="transform-opacity-animation" style="animation-duration: 1.2s" text="Apartments" color="black" />
            </router-link>
            <router-link to="/ourhouse" @click="backToTop">
                <UnderlineTextAnimated class="transform-opacity-animation" style="animation-duration: 1.4s" text="Our House" color="black" />
            </router-link>
            <UnderlineTextAnimated class="transform-opacity-animation" style="animation-duration: 1.6s" text="Impressions" color="black" />
        </div>
        <div class="flex cursor-pointer">
            <router-link to="/" @click="backToTop">
                <img class="h-20 opacity-animation" src="@/Assets/Images/rentlogo.svg" />
            </router-link>
        </div>
        <div class="flex-1 text-right">
            <WaveButton class="transform-opacity-animation" buttontext="BOOK NOW" />
        </div>
    </div>
</template>

<script lang="ts" src="./HeaderView.ts" />

<style scoped lang="postcss" src="./HeaderView.pcss" />
