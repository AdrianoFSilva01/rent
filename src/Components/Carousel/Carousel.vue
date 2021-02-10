<template>
    <div ref="relativeElement" class="relative">
        <div ref="absoluteElement" class="flex absolute h-full transform" style="cursor: grab" :onmousedown="onClick">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" src="./Carousel.ts" />
