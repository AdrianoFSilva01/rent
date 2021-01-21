<template>
    <div v-click-outside="closeComponent">
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
        <div v-show="showComponent">
            <slot name="component" />
        </div>
    </div>
</template>

<script lang="ts" src="./Dropdown.ts" />