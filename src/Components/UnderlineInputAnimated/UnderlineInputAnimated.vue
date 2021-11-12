<template>
    <div v-click-outside="underlineNone">
        <div class="input" v-bind="$attrs">
            <input class="w-full" :class="inputStyle" :placeholder="placeholderText" v-model="inputText" />
            <div id="underline" ref="underline" :class="underlineStyle" class="absolute w-0 border-b bottom-0 transition-all transform duration-main" />
        </div>
    </div>
</template>

<script lang="ts" src="./UnderlineInputAnimated.ts" />

<style scoped lang="pcss" src="./UnderlineInputAnimated.pcss" />
