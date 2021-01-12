<template>
    <button v-first-hover="'wave-button-animation'">
        <template v-for="(char, index) in buttontext" :key="index">
            <span :style="'animation-delay: calc(var(--transition-duration-main)/4/' + buttontext.length + '*' + index + ')'">
                <template v-if="char === ' '">
                    &nbsp;
                </template>
                {{ char }}
            </span>
        </template>
    </button>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class WaveButton extends Vue{
    @Prop() buttontext: string | null = null;
}
</script>

<style scoped lang="postcss" src="./WaveButton.pcss" />