<!-- prettier-ignore -->
<template>
    <div class="flex w-full items-center">
        <div class="flex-1 flex items-center space-x-10">
            <HamburgerMenu />
            <UnderlineTextAnimated text="Apartments" />
            <UnderlineTextAnimated text="Our House" />
            <UnderlineTextAnimated text="Impressions" />
        </div>
        <div class="flex cursor-pointer">
            <img class="h-24" src="@/Assets/Images/rentlogo.svg" />
        </div>
        <div class="flex-1 text-right">
            <WaveButton buttontext="BOOK NOW" />
        </div>
    </div>
</template>

<script lang="ts" src="./HeaderView.ts" />

<style scoped lang="postcss">
</style>
