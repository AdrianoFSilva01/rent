<template>
    <div class="underline-text-animated">
        <p>
            {{ text }}
        </p>
        <hr class="border-black" />
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class UnderlineTextAnimated extends Vue{
    @Prop() text: string | null = null;
}
</script>

<style scoped lang="postcss" src="./UnderlineTextAnimated.pcss" />