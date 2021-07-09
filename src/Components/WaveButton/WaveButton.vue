<template>
    <button v-first-hover="'wave-button-animation'" class="border-black">
        <template v-for="(char, index) in buttontext" :key="index">
            <span :style="'animation-delay: calc(var(--transition-duration-main)/4/' + buttontext.length + '*' + index + ')'">
                <template v-if="char === ' '">
                    &nbsp;
                </template>
                {{ char }}
            </span>
        </template>
    </button>
</template>

<script lang="ts" src="./WaveButton.ts" />

<style scoped lang="postcss" src="./WaveButton.pcss" />