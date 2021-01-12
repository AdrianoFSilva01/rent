<!-- prettier-ignore -->
<template>
    <Header class="my-10" />
</template>

<script>
import { Vue, Options } from "vue-class-component";
import Header from "@/Views/HeaderView/HeaderView.vue";

@Options({
    components: {
        Header
    }
})
export default class MasterPage extends Vue {
}
</script>
