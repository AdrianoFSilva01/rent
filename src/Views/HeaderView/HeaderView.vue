<!-- prettier-ignore -->
<template>
    <div class="flex w-full items-center">
        <div class="flex-1 flex items-center space-x-10">
            <HamburgerMenu />
            <UnderlineTextAnimated text="Apartments" />
            <UnderlineTextAnimated text="Our House" />
            <UnderlineTextAnimated text="Impressions" />
        </div>
        <div class="flex cursor-pointer">
            <img class="h-24" src="@/Assets/Images/rentlogo.svg" />
        </div>
        <div class="flex-1 text-right">
            <WaveButton buttontext="BOOK NOW" />
        </div>
    </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import HamburgerMenu from "@/Components/HamburgerMenu/HamburgerMenu.vue";
import UnderlineTextAnimated from "@/Components/UnderlineTextAnimated/UnderlineTextAnimated.vue";
import WaveButton from "@/Components/WaveButton/WaveButton.vue";

@Options({
    components:{
        HamburgerMenu,
        UnderlineTextAnimated,
        WaveButton
    }
})
export default class HeaderView extends Vue {

}
</script>

<style scoped lang="postcss">
</style>
