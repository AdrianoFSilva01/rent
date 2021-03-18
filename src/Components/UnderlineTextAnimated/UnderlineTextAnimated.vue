<template>
    <div class="flex">
        <div class="underline-text-animated">
            <p>
                {{ text }}
            </p>
            <hr :class="'border-' + color" />
        </div>
    </div>
</template>

<script lang="ts" src="./UnderlineTextAnimated.ts" />

<style scoped lang="postcss" src="./UnderlineTextAnimated.pcss" />