import { Options, Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Options({
    emits: ["selected-text-carousel"]
})
export default class TextCarousel extends Vue{
    @Prop({ default: null}) texts!: Array<string>;

    textSelected: string | null = "";
    firstClick: boolean = false;
    element: HTMLElement | null = null;
    selectedElement!: HTMLElement;
    notSelectedElementOpacity: number = 0;

    mounted(): void {
        const style: DOMTokenList = (((this.$el as HTMLElement).nextElementSibling as HTMLElement).lastElementChild as HTMLElement).classList;
        for(const styleClass of style) {
            if(styleClass.includes("opacity")) {
                if(!this.notSelectedElementOpacity) {
                    this.notSelectedElementOpacity = parseInt(styleClass.split("-")[1]) / 100;
                }
            }
        }
    }

    textSelect(event: Event | null, selectedElementIndex: number | undefined): void {
        if(selectedElementIndex !== undefined) {
            this.selectedElement = document.getElementById("" + selectedElementIndex) as HTMLElement;
            this.firstClick = true;
        } else {
            if(this.selectedElement === undefined) {
                this.selectedElement = (event?.target as HTMLElement);
                this.textSelected = this.selectedElement.textContent;
                if((event?.target as HTMLElement).innerHTML !== this.texts[0]) {
                    this.$emit("selected-text-carousel", this.textSelected);
                }
            } else if((event?.target as HTMLElement) !== this.selectedElement){
                this.selectedElement = (event?.target as HTMLElement);
                this.textSelected = this.selectedElement.textContent;
                this.$emit("selected-text-carousel", this.textSelected);
            }
        }
        this.changeStyle();
        selectedElementIndex = undefined;
    }

    changeStyle(): void {
        this.selectedElement.style.opacity = "1"
        if (this.element && this.element != this.selectedElement) {
            this.element.style.opacity = "" + this.notSelectedElementOpacity;
        }
        this.element = this.selectedElement;
    }
}