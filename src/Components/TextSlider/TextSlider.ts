import { Options, Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Options({
    emits: ["update:modelValue", "selected-text-slider"]
})
export default class TextSlider extends Vue{
    textSelected: string | null = "";
    @Prop({ default: null}) texts!: Array<string> | null;

    firstClick: boolean = false;
    element: HTMLElement | null = null;

    textSelect(event: Event): void {
        this.textSelected = (event.target as HTMLElement).textContent;
        (event.target as HTMLElement).style.opacity = "1";
        if (this.element && this.element != event.target as HTMLElement) {
            this.element.style.opacity = "0.1";
        }
        this.element = event.target as HTMLElement;
        this.$emit("selected-text-slider", this.textSelected);
    }
}