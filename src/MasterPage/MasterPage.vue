<!-- prettier-ignore -->
<template>
    <div id="round-mouse-follower" class="absolute transform duration-200 w-10 h-10 border-2 border-white rounded-full pointer-events-none hidden z-10" />
    <Header class="my-10" />
    <Main />
</template>

<script>
import { Vue, Options } from "vue-class-component";
import Header from "@/Views/HeaderView/HeaderView.vue";
import Main from "@/Views/MainView/MainView.vue";

@Options({
    components: {
        Header,
        Main
    }
})
export default class MasterPage extends Vue {
}
</script>
