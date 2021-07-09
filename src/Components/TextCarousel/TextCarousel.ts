import { Options, Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Options({
    emits: ["selected-text-carousel"]
})
export default class TextCarousel extends Vue{
    @Prop({ default: null}) texts!: Array<string> | null;
    textSelected: string | null = "";

    firstClick: boolean = false;
    element: HTMLElement | null = null;
    selectedElement!: HTMLElement;

    textSelect(event: Event | null, selectedElementIndex: number | undefined): void {
        if(selectedElementIndex !== undefined) {
            this.selectedElement = document.getElementById("" + selectedElementIndex) as HTMLElement;
            this.firstClick = true;
        } else {
            this.selectedElement = (event?.target as HTMLElement);
            this.textSelected = this.selectedElement.textContent;
            this.$emit("selected-text-carousel", this.textSelected);
        }
        this.changeStyle();
        selectedElementIndex = undefined;
    }

    changeStyle(): void {
        this.selectedElement.style.opacity = "1"
        if (this.element && this.element != this.selectedElement) {
            this.element.style.opacity = "0.1";
        }
        this.element = this.selectedElement;
    }
}