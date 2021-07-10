import { Options, Vue } from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";

@Options({
    emits: ["changed-slider-image", "activity-slider-mouse-down", "activity-slider-mouse-moving", "disable-arrow", "enable-arrow", "add-interval", "interval-loaded", "stop-interval"]
})
export default class Slider extends Vue{
    @Prop({required: true}) images!: Array<string>;
    @Prop({default: false}) draggable!: boolean;

    @Ref() mainImage!: HTMLElement;
    @Ref() backgroundImage!: HTMLElement;

    mainImageIndex: number = 0;
    backgroundImageIndex: number = 0;
    transitionEnded: boolean = true;
    transitionDuration: number = 0;
    onMouseDownClientX: number = 0;
    mainImageOpacity: number = 0;
    changeImageInterval: number = 0;
    occuringInterval: boolean = false;
    imagesElement: Array<HTMLImageElement> = [];
    divsElement: Array<HTMLElement> = [];
    resetOpacityValue: number = 0;
    duplicateClientX: number = 0;
    selectedItemIndexTeste: number = 0;
    changeOpacityElement: number = -1;
    emitStopInterval: boolean = true;

    mounted(): void {
        this.transitionDuration = parseFloat(window.getComputedStyle(this.mainImage).transitionDuration);
        this.addInterval();

        if(this.draggable) {
            (this.$el as HTMLElement).style.cursor = "grab";
        }

        for(const image in this.images) {
            this.divsElement[image] = document.createElement("div");
            this.divsElement[image].style.opacity = "0";
            this.divsElement[image].addEventListener("transitionend", () => {
                this.transitionEnded = true;

                if(this.mainImage.firstChild !== this.divsElement[this.mainImageIndex]) {
                    this.removeTransition(this.mainImage.firstChild as HTMLElement);
                } else {
                    this.removeTransitionButOpacity(this.mainImage.firstChild as HTMLElement);
                }

                if(this.mainImage.lastChild !== this.divsElement[this.mainImageIndex]) {
                    this.removeTransition(this.mainImage.lastChild as HTMLElement);
                } else {
                    this.removeTransitionButOpacity(this.mainImage.lastChild as HTMLElement);
                }

                this.removeTransitionButOpacity(this.divsElement[image]);

                this.changeOpacityElement = -1;
                this.addInterval();

                this.$emit("enable-arrow");
            });
        }

        for(const image in this.images) {
            this.imagesElement[image] = document.createElement("img");
            this.imagesElement[image].src = this.images[image];
            this.imagesElement[image].classList.add("absolute", "top-0", "object-cover", "object-center", "h-full", "w-full");
        }

        this.mainImage.appendChild(this.divsElement[this.images.length - 1]);
        this.divsElement[this.images.length - 1].appendChild(this.imagesElement[this.images.length - 1]);

        this.mainImage.appendChild(this.divsElement[0]);
        this.divsElement[0].style.opacity = "1";
        this.divsElement[0].appendChild(this.imagesElement[0]);

        this.mainImage.appendChild(this.divsElement[1]);
        this.divsElement[1].appendChild(this.imagesElement[1]);
    }

    onMouseDown(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        this.stopInterval();
        this.occuringInterval = false;
        if(this.transitionEnded) {
            if(this.draggable) {
                (this.$el as HTMLElement).style.cursor = "grabbing";
            }
            this.onMouseDownClientX = mouseEvent.clientX;
            if(this.mainImageIndex === 0) {
                this.divsElement[this.images.length - 1].style.opacity = "1"
            } else {
                this.divsElement[this.mainImageIndex - 1].style.opacity = "1";
            }
            document.onmousemove = this.onMouseMove;
            document.onmouseup = this.onMouseUp;
        }

        this.$emit("activity-slider-mouse-down");
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        const changeOpacityMargin: number = 50;
        const minOpacityValid: number = 0.01;
        const maxOpacityValid: number = 0.99;

        if(mouseEvent.clientX > this.onMouseDownClientX + changeOpacityMargin || mouseEvent.clientX < this.onMouseDownClientX - changeOpacityMargin) {
            if(this.onMouseDownClientX - mouseEvent.clientX < 0) {
                this.mainImageOpacity = 1 - (((mouseEvent.clientX - this.onMouseDownClientX) - changeOpacityMargin) / 1000);

                this.mainImageOpacity < minOpacityValid
                    ? this.divsElement[this.mainImageIndex].style.opacity = "" + minOpacityValid
                    : this.divsElement[this.mainImageIndex].style.opacity = "" + this.mainImageOpacity;
            } else if(this.onMouseDownClientX - mouseEvent.clientX > 0) {
                this.mainImageOpacity = ((this.onMouseDownClientX - mouseEvent.clientX) - changeOpacityMargin) / 1000;

                this.mainImageOpacity > maxOpacityValid
                    ? this.divsElement[this.mainImageIndex === this.images.length - 1 ? 0 : this.mainImageIndex + 1].style.opacity = "" + maxOpacityValid
                    : this.divsElement[this.mainImageIndex === this.images.length - 1 ? 0 : this.mainImageIndex + 1].style.opacity = "" + this.mainImageOpacity;
            }
        }

        this.$emit("activity-slider-mouse-moving", mouseEvent.clientX - this.onMouseDownClientX);
    }

    onMouseUp(mouseEvent: MouseEvent): void {
        document.onmousemove = null;

        if(mouseEvent.clientX < this.onMouseDownClientX) {
            this.nextImage();
        } else if(mouseEvent.clientX > this.onMouseDownClientX) {
            this.previousImage();
        } else {
            this.addInterval();
        }

        document.onmouseup = null;
    }

    nextImage(): void {
        if(this.transitionEnded) {
            if(this.draggable) {
                (this.$el as HTMLElement).style.cursor = "not-allowed";
                ((this.$el as HTMLElement).firstElementChild as HTMLElement).style.pointerEvents = "none";
            }

            this.transitionEnded = false;
            this.occuringInterval = false;
            this.emitStopInterval = false;

            this.stopInterval();

            if(this.mainImageIndex === this.images.length - 1) {
                this.mainImageIndex = 0;

                this.mainImage.appendChild(this.divsElement[this.mainImageIndex + 1]);

                setTimeout(() => {
                    this.divsElement[this.mainImageIndex + 1].appendChild(this.imagesElement[this.mainImageIndex + 1]);
                }, 1);

                this.addTransition(this.divsElement[0], 1);
            } else if (this.mainImageIndex + 1 === this.images.length - 1) {
                this.mainImage.appendChild(this.divsElement[0]);

                setTimeout(() => {
                    this.divsElement[0].appendChild(this.imagesElement[0]);
                }, 1);

                this.addTransition(this.divsElement[this.images.length - 1], 1);

                this.mainImageIndex = this.images.length - 1;
            }
            else {
                this.mainImage.appendChild(this.divsElement[++this.mainImageIndex + 1]);

                setTimeout(() => {
                    this.divsElement[this.mainImageIndex + 1].appendChild(this.imagesElement[this.mainImageIndex + 1]);
                }, 1);

                this.addTransition(this.divsElement[this.mainImageIndex], 1);
            }

            if(this.mainImage.children.length > 3 && this.mainImage.firstChild?.firstChild){
                this.removeTransition(this.mainImage.firstChild as HTMLElement);
                this.mainImage.firstChild?.removeChild(this.mainImage.firstChild.firstChild);
                this.mainImage.removeChild(this.mainImage.childNodes[0]);
            }

            this.$emit("changed-slider-image", this.mainImageIndex === - 1 ? this.images.length - 1 : this.mainImageIndex);
            this.$emit("disable-arrow");
            this.$emit("interval-loaded", this.transitionDuration);
        }
    }

    previousImage(): void {
        if(this.transitionEnded) {
            if(this.draggable) {
                (this.$el as HTMLElement).style.cursor = "not-allowed";
                ((this.$el as HTMLElement).firstElementChild as HTMLElement).style.pointerEvents = "none";
            }

            this.transitionEnded = false;
            this.occuringInterval = false;

            this.stopInterval();

            if(this.mainImageIndex === 0) {
                this.mainImage.insertBefore(this.divsElement[this.images.length - 2], this.mainImage.childNodes[0]);

                setTimeout(() => {
                    this.divsElement[this.images.length - 2].appendChild(this.imagesElement[this.images.length - 2]);
                    this.divsElement[this.images.length - 1].style.opacity = "1";
                }, 1);

                this.addTransition(this.divsElement[0], 0);

                this.mainImageIndex = this.images.length - 1;
            } else if(this.mainImageIndex - 1 === 0) {
                this.mainImage.insertBefore(this.divsElement[this.images.length - 1], this.mainImage.childNodes[0]);

                setTimeout(() => {
                    this.divsElement[this.images.length - 1].appendChild(this.imagesElement[this.images.length - 1]);
                    this.divsElement[0].style.opacity = "1";
                }, 1);

                this.addTransition(this.divsElement[this.mainImageIndex], 0);

                this.mainImageIndex = 0;
            } else {
                this.mainImage.insertBefore(this.divsElement[--this.mainImageIndex - 1], this.mainImage.childNodes[0]);

                setTimeout(() => {
                    this.divsElement[this.mainImageIndex - 1].appendChild(this.imagesElement[this.mainImageIndex - 1]);
                    this.divsElement[this.mainImageIndex].style.opacity = "1";
                }, 1);

                this.addTransition(this.divsElement[this.mainImageIndex + 1], 0);
            }

            if(this.mainImage.children.length > 3 && this.mainImage.lastChild?.firstChild){
                this.removeTransition(this.mainImage.lastChild as HTMLElement);
                this.mainImage.lastChild.removeChild(this.mainImage.lastChild.firstChild);
                this.mainImage.removeChild(this.mainImage.lastChild);
            }

            this.$emit("changed-slider-image", this.mainImageIndex === - 1 ? this.images.length - 1 : this.mainImageIndex);
            this.$emit("disable-arrow");
        }
    }

    goToIndex(index: number): void {
        if(this.transitionEnded) {
            this.transitionEnded = false;
            this.occuringInterval = false;
            this.stopInterval();

            if(index - 1 === this.mainImageIndex) {
                index === this.images.length - 1
                    ? this.mainImage.appendChild(this.divsElement[0])
                    : this.mainImage.appendChild(this.divsElement[index + 1]);

                setTimeout(() => {
                    index === this.images.length - 1
                        ? this.divsElement[0].appendChild(this.imagesElement[0])
                        : this.divsElement[index + 1].appendChild(this.imagesElement[index + 1]);
                }, 1);

                if(this.divsElement[index].style.opacity >= "1") {
                    this.transitionEnded = true;
                } else {
                    this.addTransition(this.divsElement[index], 1);
                }

                if(this.mainImage.firstChild?.firstChild){
                    this.removeTransition(this.mainImage.firstChild as HTMLElement);
                    this.mainImage.firstChild.removeChild(this.mainImage.firstChild.firstChild);
                    this.mainImage.removeChild(this.mainImage.firstChild);
                }
            } else if(index + 1 === this.mainImageIndex) {
                index === 0
                    ? this.mainImage.insertBefore(this.divsElement[this.images.length - 1], this.mainImage.childNodes[0])
                    : this.mainImage.insertBefore(this.divsElement[index - 1], this.mainImage.childNodes[0]);

                setTimeout(() => {
                    index === 0
                        ? this.divsElement[this.images.length - 1].appendChild(this.imagesElement[this.images.length - 1])
                        : this.divsElement[index - 1].appendChild(this.imagesElement[index - 1])
                }, 1);

                this.divsElement[index].style.opacity = "1";

                this.addTransition(this.divsElement[this.mainImageIndex], 0);

                if(this.mainImage.lastChild?.firstChild){
                    this.removeTransition(this.mainImage.lastChild as HTMLElement);
                    this.mainImage.lastChild.removeChild(this.mainImage.lastChild.firstChild);
                    this.mainImage.removeChild(this.mainImage.lastChild);
                }
            } else {
                const mainImageFirstChild: ChildNode | null = this.mainImage.firstChild;
                const mainImageLastChild: ChildNode | null = this.mainImage.lastChild;

                if(mainImageFirstChild?.firstChild && mainImageFirstChild !== this.divsElement[this.mainImageIndex]){
                    this.removeTransition(mainImageFirstChild as HTMLElement);
                    mainImageFirstChild.removeChild(mainImageFirstChild.firstChild);
                    this.mainImage.removeChild(mainImageFirstChild);
                }

                if(mainImageLastChild?.firstChild && mainImageLastChild !== this.divsElement[this.mainImageIndex]){
                    this.removeTransition(mainImageLastChild as HTMLElement);
                    mainImageLastChild.removeChild(mainImageLastChild.firstChild);
                    this.mainImage.removeChild(mainImageLastChild);
                }

                if(this.mainImage.children.length > 1) {
                    if(this.mainImage.firstChild !== this.divsElement[this.mainImageIndex] && this.mainImage.firstChild?.firstChild) {
                        this.removeTransition(this.mainImage.firstChild as HTMLElement);
                        this.mainImage.firstChild.removeChild(this.mainImage.firstChild.firstChild);
                        this.mainImage.removeChild(this.mainImage.firstChild);
                    } else if(this.mainImage.lastChild !== this.divsElement[this.mainImageIndex] && this.mainImage.lastChild?.firstChild) {
                        this.removeTransition(this.mainImage.lastChild as HTMLElement);
                        this.mainImage.lastChild.removeChild(this.mainImage.lastChild.firstChild);
                        this.mainImage.removeChild(this.mainImage.lastChild);
                    }
                }


                index === 0
                    ? this.mainImage.insertBefore(this.divsElement[this.images.length - 1], this.mainImage.childNodes[0])
                    : this.mainImage.insertBefore(this.divsElement[index - 1], this.mainImage.childNodes[0]);

                this.mainImage.insertBefore(this.divsElement[index], this.mainImage.childNodes[1]);

                index === this.images.length - 1
                    ? this.mainImage.insertBefore(this.divsElement[0], this.mainImage.childNodes[2])
                    : this.mainImage.insertBefore(this.divsElement[index + 1], this.mainImage.childNodes[2]);

                setTimeout(() => {
                    index === 0
                        ? this.divsElement[this.images.length - 1].appendChild(this.imagesElement[this.images.length - 1])
                        : this.divsElement[index - 1].appendChild(this.imagesElement[index - 1]);

                    this.divsElement[index].appendChild(this.imagesElement[index]);

                    index === this.images.length - 1
                        ? this.divsElement[0].appendChild(this.imagesElement[0])
                        : this.divsElement[index + 1].appendChild(this.imagesElement[index + 1]);
                }, 1);

                this.divsElement[index].style.opacity = "1";

                this.addTransition(this.divsElement[this.mainImageIndex], 0);
            }

            this.mainImageIndex = index;
        }
    }

    selectedChanging(otherComponentClientX: number, selectedItemIndex: number): void {
        if(this.changeOpacityElement < 0) {
            this.changeOpacityElement = this.mainImageIndex;
        }

        if(this.mainImageIndex > 0) {
            this.divsElement[this.mainImageIndex - 1].style.opacity = "1";
        }

        let opacityValue: number = ((otherComponentClientX / 1000) / 2) + this.resetOpacityValue;

        if(this.changeOpacityElement === 0 && opacityValue > 0) {
            opacityValue = 0;
        }

        if(this.changeOpacityElement !== this.images.length - 1) {
            this.divsElement[this.changeOpacityElement + 1].style.opacity = `${Math.abs(opacityValue)}`;
        }

        if(this.selectedItemIndexTeste !== selectedItemIndex) {
            if(this.selectedItemIndexTeste < selectedItemIndex){
                if(selectedItemIndex === this.images.length - 1) {
                    ++this.mainImageIndex;
                    this.mainImage.appendChild(this.divsElement[0]);

                    if(this.mainImage.firstChild?.firstChild && this.mainImage.children.length > 4) {
                        this.removeTransition(this.mainImage.firstChild as HTMLElement);
                        this.mainImage.firstChild?.removeChild(this.mainImage.firstChild.firstChild);
                        this.mainImage.removeChild(this.mainImage.childNodes[0]);
                    }

                    setTimeout(() => {
                        this.divsElement[0].appendChild(this.imagesElement[0]);
                    }, 1);
                } else {
                    if(this.mainImageIndex + 1 < this.images.length - 1) {
                        ++this.mainImageIndex;
                    }
                    this.mainImage.appendChild(this.divsElement[this.mainImageIndex + 1]);

                    if(this.mainImage.firstChild?.firstChild && this.mainImage.children.length > 4) {
                        this.removeTransition(this.mainImage.firstChild as HTMLElement);
                        this.mainImage.firstChild?.removeChild(this.mainImage.firstChild.firstChild);
                        this.mainImage.removeChild(this.mainImage.childNodes[0]);
                    }

                    setTimeout(() => {
                        this.divsElement[this.mainImageIndex + 1].appendChild(this.imagesElement[this.mainImageIndex + 1]);
                    }, 1);
                }
            } else if(this.selectedItemIndexTeste > selectedItemIndex) {
                if(selectedItemIndex === 0) {
                    if(this.mainImageIndex > 0) {
                        --this.mainImageIndex;
                    }
                    this.mainImage.insertBefore(this.divsElement[this.images.length - 1], this.mainImage.childNodes[0])

                    if(this.mainImage.lastChild?.firstChild && this.mainImage.children.length > 4) {
                        this.removeTransition(this.mainImage.lastChild as HTMLElement);
                        this.mainImage.lastChild.removeChild(this.mainImage.lastChild.firstChild);
                        this.mainImage.removeChild(this.mainImage.lastChild);
                    }

                    setTimeout(() => {
                        this.divsElement[this.images.length - 1].appendChild(this.imagesElement[this.images.length - 1]);
                    }, 1);
                } else {
                    if(this.mainImageIndex - 1 > 0) {
                        --this.mainImageIndex;
                    }

                    this.mainImage.insertBefore(this.divsElement[this.mainImageIndex - 1], this.mainImage.childNodes[0]);

                    if(this.mainImage.lastChild?.firstChild && this.mainImage.children.length > 4) {
                        this.removeTransition(this.mainImage.lastChild as HTMLElement);
                        this.mainImage.lastChild.removeChild(this.mainImage.lastChild.firstChild);
                        this.mainImage.removeChild(this.mainImage.lastChild);
                    }

                    setTimeout(() => {
                        this.divsElement[this.mainImageIndex - 1].appendChild(this.imagesElement[this.mainImageIndex - 1]);
                    }, 1);
                }
            }

            this.selectedItemIndexTeste = selectedItemIndex;
        }

        if(Math.ceil(opacityValue) === -1) {
            if(this.changeOpacityElement + 1 < this.images.length - 1) {
                this.resetOpacityValue += 1;
                this.changeOpacityElement += 1;
            }
        } else if(Math.ceil(opacityValue) === 1) {
            if(this.changeOpacityElement > 0) {
                this.resetOpacityValue -= 1;
                this.changeOpacityElement -= 1;
            }
        }

        this.mainImageIndex = selectedItemIndex;
    }

    selectedChanged(index: number): void {
        this.occuringInterval = false;
        this.resetOpacityValue = 0;

        if(index < this.mainImageIndex) {
            if(index === 0) {
                --this.mainImageIndex;
                this.mainImage.insertBefore(this.divsElement[this.images.length - 1], this.mainImage.childNodes[0]);

                if(this.mainImage.lastChild && this.mainImage.lastChild.firstChild) {
                    this.removeTransition(this.mainImage.lastChild as HTMLElement);
                    this.mainImage.lastChild.removeChild(this.mainImage.lastChild.firstChild);
                    this.mainImage.removeChild(this.mainImage.lastChild);
                }

                setTimeout(() => {
                    this.divsElement[this.images.length - 1].appendChild(this.imagesElement[this.images.length - 1]);
                }, 1);

                this.addTransition(this.divsElement[this.mainImageIndex + 1], 0);
            } else {
                this.mainImage.insertBefore(this.divsElement[--this.mainImageIndex - 1], this.mainImage.childNodes[0]);

                if(this.mainImage.lastChild && this.mainImage.lastChild.firstChild) {
                    this.removeTransition(this.mainImage.lastChild as HTMLElement);
                    this.mainImage.lastChild.removeChild(this.mainImage.lastChild.firstChild);
                    this.mainImage.removeChild(this.mainImage.lastChild);
                }

                setTimeout(() => {
                    this.divsElement[this.mainImageIndex - 1].appendChild(this.imagesElement[this.mainImageIndex - 1]);
                }, 1);

                this.addTransition(this.divsElement[this.mainImageIndex], 1);
                this.addTransition(this.divsElement[this.mainImageIndex + 1], 0);
            }
        } else if(index > this.mainImageIndex) {
            if(index === this.images.length - 1) {
                ++this.mainImageIndex
                this.mainImage.appendChild(this.divsElement[0]);

                if(this.mainImage.firstChild?.firstChild) {
                    this.removeTransition(this.mainImage.firstChild as HTMLElement);
                    this.mainImage.firstChild?.removeChild(this.mainImage.firstChild.firstChild);
                    this.mainImage.removeChild(this.mainImage.childNodes[0]);
                }

                setTimeout(() => {
                    this.divsElement[0].appendChild(this.imagesElement[0]);
                }, 1);

                this.addTransition(this.divsElement[this.mainImageIndex], 1);
            } else {
                this.mainImage.appendChild(this.divsElement[++this.mainImageIndex + 1]);

                if(this.mainImage.firstChild?.firstChild) {
                    this.removeTransition(this.mainImage.firstChild as HTMLElement);
                    this.mainImage.firstChild?.removeChild(this.mainImage.firstChild.firstChild);
                    this.mainImage.removeChild(this.mainImage.childNodes[0]);
                }

                setTimeout(() => {
                    this.divsElement[this.mainImageIndex + 1].appendChild(this.imagesElement[this.mainImageIndex + 1]);
                }, 1);

                this.addTransition(this.divsElement[this.mainImageIndex], 1);
            }
        } else {
            if(this.divsElement[this.mainImageIndex].style.opacity >= "1") {
                this.removeTransitionButOpacity(this.divsElement[this.mainImageIndex]);
                this.changeOpacityElement = -1;
            } else {
                this.addTransition(this.divsElement[this.mainImageIndex], 1);
            }

            if(index !== this.images.length - 1) {
                if(this.divsElement[this.mainImageIndex + 1].style.opacity <= "0") {
                    this.removeTransitionButOpacity(this.divsElement[this.mainImageIndex + 1]);
                    this.changeOpacityElement = -1;
                } else {
                    this.addTransition(this.divsElement[this.mainImageIndex + 1], 0);
                }
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
        element.style.opacity = "0";
    }

    removeTransitionButOpacity(element: HTMLElement): void {
        element.style.transition = "none";
        element.style.transitionDuration = "0s";
    }

    addInterval(): void {
        const intervalTimer: number = 7000;
        if(!this.occuringInterval) {
            this.changeImageInterval = setInterval(() => {
                this.nextImage();
            }, intervalTimer);
            this.$emit("add-interval", intervalTimer);
        }
        this.occuringInterval = true;
    }

    stopInterval(): void {
        clearInterval(this.changeImageInterval);
        if(this.emitStopInterval) {
            this.$emit("stop-interval", this.transitionDuration);
        }
        this.emitStopInterval = true;
    }
}