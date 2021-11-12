import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop, Ref } from "vue-property-decorator";

@Options({
    emits: ["update:modelValue"]
})
export default class UnderlineInputAnimated extends Vue {
    @ModelSync("modelValue", "update:modelValue") inputText!: string;
    @Prop({required: true}) placeholderText!: string;
    @Prop() inputStyle!: string;
    @Prop() underlineStyle!: string;
    @Ref() underline!: HTMLElement;
}