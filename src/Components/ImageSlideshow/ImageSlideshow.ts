import { Vue } from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";

export default class ImageSlideshow extends Vue {
    @Ref() imgContainer!: HTMLElement;
    @Ref() imgElement!: HTMLElement;

    @Prop() images!: Array<string>;
    @Prop({default: 0.5}) imgPerSec!: number;

    imageSize: number = 0;
    imageInicialPosition: number = 0;
    spaceBetweenElements: number = 16;
    transitionDuration: number = 0;
    transitionDelay: number = 2;

    mounted(): void {
        this.imageSize = this.imgContainer.offsetWidth;
        this.imageInicialPosition = this.imgContainer.offsetLeft;
        this.transitionDuration = (this.images.length / this.imgPerSec) / this.images.length;
        if(parseInt(window.getComputedStyle(this.imgContainer).transitionDelay)) {
            this.transitionDelay = parseInt(window.getComputedStyle(this.imgContainer).transitionDelay);
        }

        this.imgContainer.style.animationDuration = this.transitionDuration + "s";
        this.imgContainer.style.height = this.imageSize + "px";
        this.spaceBetweenElements = parseInt(window.getComputedStyle(this.imgContainer).margin);
        this.imgContainer.style.margin = "0px";

        const startingImagesNumber: number = Math.ceil((window.innerWidth - this.imageInicialPosition) / this.imageSize) + 1;
        const imgContainerWidth: number = (this.imageSize + this.spaceBetweenElements) * this.images.length;
        let imgIndex: number = 0;

        this.imgContainer.style.width = imgContainerWidth + "px";

        for(let i: number = 0; i < startingImagesNumber; i++) {
            imgIndex = i - (Math.floor(i / this.images.length) * this.images.length);

            const element: HTMLImageElement = document.createElement("img");
            element.src = this.images[imgIndex];
            element.classList.add("object-cover", "absolute", "transition-all", "ease-linear");
            element.style.width = this.imageSize + "px";
            element.style.height = this.imageSize + "px";
            element.style.left = `${i * (this.imageSize + this.spaceBetweenElements)}px`;

            const firstElementLeft: number = ((this.imageSize + this.spaceBetweenElements) + this.imageInicialPosition);
            const thisElementLeft: number = ((i + 1) * (this.imageSize + this.spaceBetweenElements)) + this.imageInicialPosition;

            element.style.transitionDuration = ((thisElementLeft * this.transitionDuration) / firstElementLeft)+ "s";

            element.addEventListener("transitionend", () => {
                imgIndex + 1 === this.images.length ? imgIndex = 0 : imgIndex++;
                this.onTransitionEnd(imgIndex);
            });

            setTimeout(() => {
                element.style.transform = `translateX(-${((i + 1) * (this.imageSize + this.spaceBetweenElements)) + this.imageInicialPosition}px)`;
            }, this.transitionDelay * 1000);

            this.imgContainer.appendChild(element);
        }
    }

    onTransitionEnd(index: number): void {
        this.imgContainer.removeChild(this.imgContainer.children[0]);

        const element: HTMLImageElement = document.createElement("img");
        element.src = this.images[index];
        element.classList.add("object-cover", "absolute", "transition-all", "ease-linear");
        element.style.width = this.imageSize + "px";
        element.style.height = this.imageSize + "px";
        element.style.left = `${(this.images.length * (this.imageSize + this.spaceBetweenElements)) - this.imageInicialPosition}px`;

        const firstElementLeft: number = ((this.imageSize + this.spaceBetweenElements) + this.imageInicialPosition);
        const thisElementLeft: number = ((this.images.length + 1) * (this.imageSize + this.spaceBetweenElements));

        element.style.transitionDuration = ((thisElementLeft * this.transitionDuration) / firstElementLeft) + "s";

        element.addEventListener("transitionend", () => {
            index + 1 === this.images.length ? index = 0 : index++;
            this.onTransitionEnd(index);
        });

        setTimeout(() => {
            element.style.transform = `translateX(-${(this.images.length + 1) * (this.imageSize + this.spaceBetweenElements)}px)`;
        }, 0);

        this.imgContainer.appendChild(element);
    }
}