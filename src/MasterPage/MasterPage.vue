<!-- prettier-ignore -->
<template>
    <div id="round-mouse-follower" class="absolute w-10 h-10 border-2 border-white rounded-full pointer-events-none hidden z-10" />
    <Overlay ref="overlay" />
    <Header @display-overlay="displayOverlay" class="my-10" />
    <router-view />
    <Footer class="my-28" />
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Header from "@/Views/HeaderView/HeaderView.vue";
import Main from "@/Views/MainView/MainView.vue";
import Footer from "@/Views/FooterView/FooterView.vue";
import Overlay from "@/Views/OverlayView/OverlayView.vue";
import OverlayTs from "@/Views/OverlayView/OverlayView";
import { Ref } from "vue-property-decorator";

@Options({
    components: {
        Header,
        Main,
        Footer,
        Overlay
    }
})
export default class MasterPage extends Vue {
    @Ref() overlay!: OverlayTs;

    displayOverlay(): void {
        this.overlay.toogleDisplay();
    }
}
</script>
