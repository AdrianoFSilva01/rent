<template>
    <div>
        <template v-for="(option, index) in list" :key="index">
            <p @click="onSelected(option)" v-bind="$attrs">
                {{ option }}
            </p>
        </template>
    </div>
</template>

<script lang="ts" src="./DropdownList.ts" />

<style scoped lang="postcss" src="./DropdownList.pcss" />