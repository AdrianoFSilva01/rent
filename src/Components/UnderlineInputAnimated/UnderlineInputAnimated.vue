<template>
    <div v-click-outside="underlineNone">
        <div class="input" v-bind="$attrs" @click="underlineFull">
            <input class="w-full" :placeholder="placeholderText" />
            <div ref="underline" class="absolute w-0 border-b border-white bottom-0 transition-all transform duration-main" />
        </div>
    </div>
</template>

<script lang="ts" src="./UnderlineInputAnimated.ts" />

<style scoped lang="pcss" src="./UnderlineInputAnimated.pcss" />
