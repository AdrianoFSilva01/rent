import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop, Ref } from "vue-property-decorator";

@Options({
    emits: [
        'update:modelValue',
        "changed-slider-image",
        "activity-slider-mouse-down",
        "activity-slider-mouse-moving",
        "activity-slider-mouse-up",
        "disable-arrow",
        "enable-arrow",
        "add-interval",
        "interval-loaded",
        "stop-interval",
        "no-changes-made"
    ]
})
export default class Slider extends Vue{
    @ModelSync('modelValue', 'update:modelValue') selectedIndex!: number;

    @Prop({required: true}) images!: Array<string>;
    @Prop({default: false}) draggable!: boolean;

    @Ref() previousContainer!: HTMLElement;
    @Ref() currentContainer!: HTMLElement;
    @Ref() nextContainer!: HTMLElement;

    transitionEnded: boolean = true;
    transitionDuration: number = 0;
    onMouseDownClientX: number = 0;
    mouseMoved: boolean = false;
    mainImageOpacity: number = 0;
    changeImageInterval: number = 0;
    occuringInterval: boolean = false;
    imagesElement: Array<HTMLImageElement> = [];
    changeOpacityMarginPercentage: number = 15;
    changeOpacityMargin: number = 0;
    emitStopInterval: boolean = true;
    onMouseUpMillisecond: number = 0;
    onMouseDownMillisecond: number = 0;

    mounted(): void {
        const parentElement: HTMLElement | null = (this.$el as HTMLElement).parentElement;
        if(parentElement) {
            this.changeOpacityMargin = (this.changeOpacityMarginPercentage / 100) * parentElement.offsetWidth;
        }
        this.transitionDuration = parseFloat(window.getComputedStyle(this.$el).transitionDuration);
        this.addInterval();

        if(this.draggable) {
            this.cursorStyleAfterTransition();
        }

        for(const element of (this.$el as HTMLElement).children) {
            element.addEventListener("transitionend", () => {
                this.onTransitionEnd();

                this.$emit("enable-arrow");
            });
        }

        for(const image in this.images) {
            this.imagesElement[image] = document.createElement("img");
            this.imagesElement[image].src = this.images[image];
            this.imagesElement[image].draggable = false;
            this.imagesElement[image].classList.add("absolute", "top-0", "object-cover", "object-center", "h-full", "w-full");
        }

        this.previousContainer.appendChild(this.imagesElement[this.images.length - 1]);
        this.previousContainer.style.opacity = "1";
        this.currentContainer.appendChild(this.imagesElement[0]);
        this.currentContainer.style.opacity = "1";
        this.nextContainer.appendChild(this.imagesElement[1]);
        this.nextContainer.style.opacity = "0";
    }

    onTransitionEnd(): void {
        this.transitionEnded = true;

        const firstChildIndex: number = this.selectedIndex === 0 ? this.images.length - 1 : this.selectedIndex - 1;
        const lastChildIndex: number = this.selectedIndex === this.images.length - 1 ? 0 : this.selectedIndex + 1;

        this.setElementChild(this.previousContainer, firstChildIndex, 1);
        this.setElementChild(this.currentContainer, this.selectedIndex, 1);
        this.setElementChild(this.nextContainer, lastChildIndex, 0);

        this.removeTransition(this.previousContainer);
        this.removeTransition(this.currentContainer);
        this.removeTransition(this.nextContainer);

        this.addInterval();
    }

    onMouseDown(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        this.stopInterval();

        if(this.transitionEnded) {
            if(this.draggable) {
                this.cursorStyleWithoutTransition();
            }

            this.onMouseDownClientX = mouseEvent.clientX;

            this.onMouseDownMillisecond = (new Date().getMinutes() * 60000) + (new Date().getSeconds() * 1000) + new Date().getMilliseconds();

            document.onmousemove = this.onMouseMove;
            document.onmouseup = this.onMouseUp;
        }

        this.$emit("activity-slider-mouse-down");
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        const minOpacityValid: number = 0.01;
        const maxOpacityValid: number = 0.99;
        const notMovingBetweenMargins: boolean = mouseEvent.clientX > this.onMouseDownClientX + this.changeOpacityMargin || mouseEvent.clientX < this.onMouseDownClientX - this.changeOpacityMargin;
        this.mouseMoved = true;

        if(notMovingBetweenMargins) {
            const movingLeft: boolean = this.onMouseDownClientX - mouseEvent.clientX > 0;
            const movingRight: boolean = this.onMouseDownClientX - mouseEvent.clientX < 0;


            if(movingRight) {
                this.mainImageOpacity = 1 - (((mouseEvent.clientX - this.onMouseDownClientX) - this.changeOpacityMargin) / 1000);

                this.mainImageOpacity < minOpacityValid
                    ? (this.currentContainer).style.opacity = "" + minOpacityValid
                    : (this.currentContainer).style.opacity = "" + this.mainImageOpacity;

                // console.log(Math.trunc(this.selectedIndex + minOpacityValid) - 1);

            } else if(movingLeft) {
                this.mainImageOpacity = ((this.onMouseDownClientX - mouseEvent.clientX) - this.changeOpacityMargin) / 1000;

                this.mainImageOpacity > maxOpacityValid
                    ? (this.nextContainer).style.opacity = "" + maxOpacityValid
                    : (this.nextContainer).style.opacity = "" + this.mainImageOpacity;

                // console.log(Math.trunc(this.selectedIndex + maxOpacityValid) + 1);
                // this.selectedIndex = Math.trunc(this.selectedIndex + maxOpacityValid) + 1;
            }
        } else {
            // const teste: number = (this.onMouseDownClientX - mouseEvent.clientX) / 1000;
        }

        const parentElement: HTMLElement | null = (this.$el as HTMLElement).parentElement;

        if(parentElement) {
            this.$emit("activity-slider-mouse-moving", ((mouseEvent.clientX - this.onMouseDownClientX) / parentElement.offsetWidth) * 100);
        }
    }

    onMouseUp(mouseEvent: MouseEvent): void {
        document.onmousemove = null;

        const movedRight: boolean = mouseEvent.clientX >= this.onMouseDownClientX + this.changeOpacityMargin;
        const movedLeft: boolean = mouseEvent.clientX <= this.onMouseDownClientX - this.changeOpacityMargin;

        if(movedLeft) {
            if(this.transitionEnded) {
                this.nextImage(true);
            }
        } else if(movedRight) {
            if(this.transitionEnded) {
                this.previousImage();
            }
        } else {
            this.cursorStyleWithTransition();

            const didntChangePosition: boolean = mouseEvent.clientX === this.onMouseDownClientX;

            if(didntChangePosition) {
                this.onMouseUpMillisecond = (new Date().getMinutes() * 60000) + (new Date().getSeconds() * 1000) + new Date().getMilliseconds();

                const clickWasFasterThanTransition: boolean = this.onMouseUpMillisecond - this.onMouseDownMillisecond < this.transitionDuration * 1000;

                if(clickWasFasterThanTransition) {
                    const timeRemainToTransitionEnd: number = (this.transitionDuration * 1000) - (this.onMouseUpMillisecond - this.onMouseDownMillisecond);

                    setTimeout(() => {
                        this.addInterval();
                        this.cursorStyleAfterTransition();
                        this.$emit("no-changes-made");
                    }, timeRemainToTransitionEnd);
                } else {
                    this.addInterval();
                    this.cursorStyleAfterTransition();
                    this.$emit("no-changes-made");
                }
            } else {
                this.onMouseUpMillisecond = (new Date().getMinutes() * 60000) + (new Date().getSeconds() * 1000) + new Date().getMilliseconds();

                const clickWasFasterThanTransition: boolean = this.onMouseUpMillisecond - this.onMouseDownMillisecond < this.transitionDuration * 1000;

                if(clickWasFasterThanTransition) {
                    const timeRemainToTransitionEnd: number = (this.transitionDuration * 1000) - (this.onMouseUpMillisecond - this.onMouseDownMillisecond);

                    setTimeout(() => {
                        this.cursorStyleAfterTransition();
                        this.$emit("activity-slider-mouse-up", true);
                    }, timeRemainToTransitionEnd);
                } else {
                    this.cursorStyleAfterTransition();
                    this.$emit("activity-slider-mouse-up", true);
                }
            }
        }

        this.mouseMoved = false;
        document.onmouseup = null;
    }

    nextImage(buttonClicked: boolean): void {
        if(this.transitionEnded) {
            this.selectedIndex = this.selectedIndex === this.images.length - 1 ? 0 : this.selectedIndex + 1;

            this.transitionEnded = false;
            this.stopInterval();

            if(this.draggable) {
                this.cursorStyleWithTransition();
            }

            this.addTransition(this.nextContainer, 1);

            buttonClicked
                ? this.$emit("stop-interval", this.transitionDuration)
                : this.$emit("interval-loaded", this.transitionDuration);
            this.$nextTick(() => {
                this.$emit("changed-slider-image");
            });
            this.$emit("disable-arrow");
        }
    }

    previousImage(): void {
        if(this.transitionEnded) {
            this.selectedIndex = this.selectedIndex === 0 ? this.images.length - 1 : this.selectedIndex - 1;

            this.transitionEnded = false;
            this.stopInterval();

            if(this.draggable) {
                this.cursorStyleWithTransition();
            }

            this.addTransition(this.previousContainer, 1);
            this.addTransition(this.currentContainer, 0);

            this.$nextTick(() => {
                this.$emit("changed-slider-image");
            });
            this.$emit("disable-arrow");
        }
    }

    goToIndex(): void {
        if(this.transitionEnded) {
            this.transitionEnded = false;
            this.stopInterval();

            this.setElementChild(this.nextContainer, this.selectedIndex, 0);

            this.addTransition(this.nextContainer, 1);
        }
    }

    selectedChanging(percentageMoved: number): void {
        this.cursorStyleWithoutTransition();
        this.mouseMoved = true;

        if(percentageMoved >= 0 && percentageMoved <= 100) {
            const floatIndex: number = percentageMoved / (100 / (this.images.length - 1));
            const firstChildIndex: number = Math.trunc(floatIndex) === 0 ? this.images.length - 1 : Math.trunc(floatIndex) - 1;
            const lastChildIndex: number = Math.trunc(floatIndex) === this.images.length - 1 ? 0 : Math.trunc(floatIndex) + 1;

            if(this.nextContainer.firstChild === this.imagesElement[Math.trunc(floatIndex)]) {
                this.setElementChild(this.nextContainer, lastChildIndex, 0);
                this.setElementChild(this.currentContainer, Math.trunc(floatIndex), 1);
                this.setElementChild(this.previousContainer, firstChildIndex, 1);
            } else {
                this.setElementChild(this.previousContainer, firstChildIndex, 1);
                this.setElementChild(this.currentContainer, Math.trunc(floatIndex), 1);
                this.setElementChild(this.nextContainer, lastChildIndex, 0);
            }

            this.nextContainer.style.opacity = `${floatIndex - Math.trunc(floatIndex)}`;
        }
    }

    setElementChild(element: HTMLElement, index: number, opacity: number): void {
        if(element.firstChild !== this.imagesElement[index]) {
            element.style.opacity = "0";
            if(element.firstChild) {
                element.replaceChild(this.imagesElement[index], element.firstChild);
            } else {
                element.appendChild(this.imagesElement[index]);
            }
            element.style.opacity = `${opacity}`;
        }
    }

    selectedChanged(): void {
        this.transitionEnded = false;
        this.mouseMoved = false;

        if(this.nextContainer.firstChild !== this.imagesElement[this.selectedIndex]) {
            if(this.currentContainer.style.opacity === "1" && this.nextContainer.style.opacity === "0") {
                this.onTransitionEnd();
            } else {
                this.addTransition(this.currentContainer, 1);
                this.addTransition(this.nextContainer, 0);
            }
        } else {
            if(this.nextContainer.style.opacity === "1") {
                this.onTransitionEnd();
            } else {
                this.addTransition(this.nextContainer, 1);
            }
        }
    }

    addTransition(element: HTMLElement, opacity: number): void {
        element.style.transition = "all";
        element.style.transitionDuration = this.transitionDuration + "s";
        element.style.opacity = "" + opacity;
    }

    removeTransition(element: HTMLElement): void {
        element.style.transition = "none";
        element.style.transitionDuration = "0s";
    }

    cursorStyleWithTransition(): void {
        (this.$el as HTMLElement).style.cursor = "not-allowed";
        document.getElementsByTagName("body")[0].style.cursor = "default";
        ((this.$el as HTMLElement).firstElementChild as HTMLElement).style.pointerEvents = "none";
    }

    cursorStyleWithoutTransition(): void {
        (this.$el as HTMLElement).style.cursor = "grabbing";
        document.getElementsByTagName("body")[0].style.cursor = "grabbing";
        ((this.$el as HTMLElement).firstElementChild as HTMLElement).style.pointerEvents = "auto";
    }

    cursorStyleAfterTransition(): void {
        (this.$el as HTMLElement).style.cursor = "grab";
        document.getElementsByTagName("body")[0].style.cursor = "default";
        ((this.$el as HTMLElement).firstElementChild as HTMLElement).style.pointerEvents = "auto";
    }

    addInterval(): void {
        const intervalTimer: number = 7000;
        if(!this.occuringInterval) {
            this.changeImageInterval = setInterval(() => {
                this.nextImage(false);
            }, intervalTimer);
            this.$emit("add-interval", intervalTimer);
        }
        this.occuringInterval = true;
    }

    stopInterval(): void {
        clearInterval(this.changeImageInterval);
        this.occuringInterval = false;
        if(this.emitStopInterval) {
            this.$emit("stop-interval", this.transitionDuration);
        }
        this.emitStopInterval = true;
    }
}