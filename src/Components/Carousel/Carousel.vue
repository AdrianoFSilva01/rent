<template>
    <div class="relative">
        <div class="flex absolute h-full transform" @mousedown="onMouseDown" @transitionend.self="afterTransition">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" src="./Carousel.ts" />
