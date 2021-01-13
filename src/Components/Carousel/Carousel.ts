import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop } from "vue-property-decorator";

@Options({
    emits: ["update:modelValue"]
})
export default class Carousel extends Vue{
    @Prop() image: string | undefined;
    @ModelSync("modelValue", "update:modelValue") transitionEnded!: boolean;
}