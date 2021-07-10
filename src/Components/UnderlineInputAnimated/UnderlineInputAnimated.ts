import { Vue } from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";

export default class UnderlineInputAnimated extends Vue {
    @Prop({required: true}) placeholderText!: string;
    @Ref() underline!: HTMLElement;

    underlineFull(): void {
        this.underline.classList.remove("w-0");
        this.underline.classList.add("w-full");
        this.underline.classList.add("noHover");
    }

    underlineNone(): void {
        this.underline.classList.remove("noHover");
        this.underline.classList.remove("w-full");
        this.underline.classList.add("w-0");
    }
}