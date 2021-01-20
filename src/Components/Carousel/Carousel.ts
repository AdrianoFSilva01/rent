import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class Carousel extends Vue{
    @Prop() images!: Array<string>;
    transitionEnded: boolean = true;
    index: number = 0;
    imageChangeInterval: number = 0;

    mounted(): void {
        this.imageChangeInterval = setInterval(this.nextImage, 5000);
    }

    previousImage(): void {
        let index: number = this.index - 1;
        if(index < 0) {
            index = this.images.length - 1;
        }
        this.changeImage(index);
    }

    nextImage(): void {
        let index: number = this.index + 1;
        if(index === this.images.length) {
            index = 0;
        }
        this.changeImage(index);
    }

    changeImage(index: number): void {
        clearInterval(this.imageChangeInterval);
        if (this.transitionEnded) {
            this.index = index;
            this.imageChangeInterval = setInterval(this.nextImage, 5000);
            this.transitionEnded = false;
        }
    }
}