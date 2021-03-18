<!-- prettier-ignore -->
<template>
    <div id="round-mouse-follower" class="absolute transform duration-200 w-10 h-10 border-2 border-white rounded-full pointer-events-none hidden z-10" />
    <Header class="my-10" />
    <Main />
    <Footer class="my-28" />
</template>

<script>
import { Vue, Options } from "vue-class-component";
import Header from "@/Views/HeaderView/HeaderView.vue";
import Main from "@/Views/MainView/MainView.vue";
import Footer from "@/Views/FooterView/FooterView.vue";

@Options({
    components: {
        Header,
        Main,
        Footer
    }
})
export default class MasterPage extends Vue {
}
</script>
