<!-- prettier-ignore -->
<template>
    <div></div>
</template>

<script>
import { Vue, Options } from "vue-class-component";
import Header from "@/Views/HeaderView.vue";

@Options({
    components: {
        Header
    }
})
export default class MasterPage extends Vue {
}
</script>
