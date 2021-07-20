<template>
    <div v-click-outside="closeComponent" v-scroll-outside="closeComponent" v-bind="$attrs">
        <div class="flex justify-between" @click="toggleComponent">
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
                <DropdownList :class="styleClass" :list="source" v-model="selected" />
            </slot>
        </div>
    </div>
</template>

<script lang="ts" src="./Dropdown.ts" />

<style scoped lang="postcss" src="./Dropdown.pcss" />