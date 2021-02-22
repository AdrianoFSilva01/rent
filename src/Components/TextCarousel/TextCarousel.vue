<template>
    <div v-for="(text, index) in texts" :key="index" v-bind="$attrs">
        <template v-if="index != 0">
            <slot name="divider">
                <hr class="w-8 border-black mx-2" />
            </slot>
        </template>
        <span @click="textSelect($event), firstClick = true" class="transition duration-main opacity-10 cursor-pointer" :class="firstClick ? '' : 'first:opacity-100'">
            <slot :text="text">
                {{ text }}
            </slot>
        </span>
    </div>
</template>

<script lang="ts" src="./TextCarousel.ts" />