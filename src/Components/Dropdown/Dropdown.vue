<template>
    <div v-click-outside="closeComponent" v-scroll-outside="closeComponent">
        <div class="flex justify-between cursor-pointer" @click="toggleComponent">
            <div v-if="selected">
                <slot name="selected" :selected="selected">
                    {{ selected.toString() }}
                </slot>
            </div>
            <div v-else>
                {{ dropdownText }}
            </div>
            <slot />
        </div>
        <div ref="component" class="component">
            <slot name="component">
                <DropdownList v-bind="$attrs" :list="source" v-model="selected" />
            </slot>
        </div>
    </div>
</template>

<script lang="ts" src="./Dropdown.ts" />

<style scoped lang="postcss" src="./Dropdown.pcss" />