import { Vue } from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";

export default class ImageReveal extends Vue {
    @Ref() container!: HTMLElement;
    @Ref() dragElement!: HTMLElement;
    @Ref() changeWidthElement!: HTMLElement;

    @Prop() images!: Array<string>;

    containerWidth: number = 0;
    containerHeight: number = 0;
    dragElementSize: number = 0;
    dragElementPositionLeft: number = 0;
    dragElementPositionTop: number = 0;
    middleDistance: number = 0;

    mounted(): void {
        this.containerWidth = parseInt(window.getComputedStyle(this.container).width);
        this.containerHeight = parseInt(window.getComputedStyle(this.container).height);
        this.dragElementSize = parseInt(window.getComputedStyle(this.dragElement).width);
        this.dragElementPositionLeft = (this.containerWidth / 2) - (this.dragElementSize / 2);
        this.dragElementPositionTop = (this.containerHeight / 2) - (this.dragElementSize / 2);
        this.dragElement.style.left = this.dragElementPositionLeft + "px";
        this.dragElement.style.top = this.dragElementPositionTop + "px";

        this.dragElement.addEventListener("mousedown", (mouseEvent: MouseEvent) => {
            this.middleDistance = ((mouseEvent.clientX - this.container.offsetLeft) - (this.dragElementSize / 2)) - parseInt(this.dragElement.style.left);
            document.addEventListener("mousemove", this.mouseMove);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", this.mouseMove);
            });
        });
    }

    mouseMove(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        const percentage: number = (((mouseEvent.clientX - this.middleDistance) - this.container.offsetLeft) / this.containerWidth) * 100;
        if(percentage <= 100 && percentage >= 0) {
            this.dragElement.style.left = ((((mouseEvent.clientX - this.middleDistance) - this.container.offsetLeft) - (this.dragElementSize / 2))) + "px";
            this.changeWidthElement.style.width = percentage + "%";
        } else if(percentage < 0) {
            this.dragElement.style.left = -(this.dragElementSize / 2) + "px";
            this.changeWidthElement.style.width = 0 + "%";
        } else if(percentage > 100) {
            this.dragElement.style.left = (this.containerWidth - (this.dragElementSize / 2)) + "px";
            this.changeWidthElement.style.width = 100 + "%";
        }
    }
}