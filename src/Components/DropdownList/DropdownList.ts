import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop } from "vue-property-decorator";

@Options({
    inheritAttrs: false,
    emits: ["update:modelValue"]
})
export default class DropdownList<T> extends Vue {
    @ModelSync("modelValue", "update:modelValue", { default: null} ) selected!: T;
    @Prop({default: null}) list!: Array<T>;

    onSelected(selected: T): void {
        this.selected = selected;
    }
}