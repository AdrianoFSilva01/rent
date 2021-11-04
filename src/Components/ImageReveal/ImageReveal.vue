<template>
    <div ref="container" class="relative">
        <div class="w-full h-full absolute">
            <img class="w-full h-full object-cover" :src="images[0]" />
        </div>
        <div ref="changeWidthElement" class="w-full h-full absolute bg-cover overflow-hidden" style="width: 50%">
            <div class="absolute h-full" :style="'width:' + containerWidth + 'px'">
                <img class="w-full h-full object-cover" :src="images[1]" />
            </div>
        </div>
        <div ref="dragElement" class="w-10 h-10 absolute border-2 border-white rounded-full" />
    </div>
</template>

<script lang="ts" src="./ImageReveal.ts" />