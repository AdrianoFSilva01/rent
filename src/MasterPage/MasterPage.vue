<!-- prettier-ignore -->
<template>
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
