import { DebouncedFunction, Procedure } from 'ts-debounce';
import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop } from "vue-property-decorator";

@Options({
    emits: ["stop-slider-interval",
        "selected-changed",
        "activity-carousel-mouse-moving",
        "activity-carousel-mouse-up",
        'update:nextButton',
        'update:previousButton',
        'update:beingDragged',
        'update:modelValue',
        "update:isCarouselExtreme",
        "carousel-onmousemove",
        "disable-arrow",
        "enable-arrow"
    ]
})
export default class Carousel extends Vue{
    @ModelSync('nextButton', 'update:nextButton') disableNextButton: boolean = false;
    @ModelSync('previousButton', 'update:previousButton') disablePreviousButton: boolean = false;
    @ModelSync('beingDragged', 'update:beingDragged') dragged: boolean = false;
    @ModelSync('modelValue', 'update:modelValue') selectedItemIndex: number = 0;
    @ModelSync('isCarouselExtreme', 'update:isCarouselExtreme') isExtreme: boolean = false;

    @Prop() selectedPosition: number = 0;
    @Prop() clickToMove: boolean = false;

    relativeElement!: HTMLElement;
    absoluteElement!: HTMLElement;
    mousePosition: number = 0;
    inicialPosition: number = 0;
    childElementWidth: number = 0;
    firstClickValue: number = 0;
    finalPosition: number = 0;
    enterExtremeValue: number = 0;
    rightExtreme: number = 0;
    leftMargin: number = 0;
    debouncedFunction!: DebouncedFunction<Procedure>;
    transitionEnded: boolean = true;
    mouseMoved: boolean = false;
    didntAlign: boolean = false;
    selectedIndex: number = 0;
    changeFinalPosition: boolean = false;
    transitionDuration: number = 0;

    mounted(): void {
        this.transitionDuration = parseFloat(window.getComputedStyle(this.$el).transitionDuration);
        this.relativeElement = this.$el as HTMLElement;
        this.absoluteElement = (this.$el as HTMLElement).firstElementChild as HTMLElement;
        this.leftMargin = this.absoluteElement.offsetLeft;
        this.disablePreviousButton = true;
        this.childElementWidth = this.getChildElementWidth();

        if (this.selectedPosition) {
            this.inicialPosition = this.relativeElement.offsetWidth / 2 - this.childElementWidth / 2;
        }
        this.translateX(this.inicialPosition);

        this.rightExtreme = this.getRightExtreme();

        this.absoluteElement.addEventListener("transitionend", (event: Event) => {
            if(this.changeFinalPosition && event.target === this.absoluteElement) {
                this.relativeElement.style.cursor = "grab";
                this.absoluteElement.style.pointerEvents = "auto";
                this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";
                this.transitionEnded = true;
                this.changeFinalPosition = false;
                this.selectedIndex = Math.abs((this.getTranslateX(this.absoluteElement) - this.inicialPosition) / this.childElementWidth);
                this.finalPosition = this.getTranslateX(this.absoluteElement);
                this.$emit("enable-arrow", this.disableNextButton, this.disablePreviousButton);
            }
        })

        this.relativeElement.style.cursor = "grab";
        this.absoluteElement.style.transitionProperty = "all";
        this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";
    }

    getChildElementWidth(): number {
        const absoluteChildElement: HTMLElement = this.absoluteElement.firstElementChild as HTMLElement;
        const aboluteElementStyle: CSSStyleDeclaration = window.getComputedStyle(absoluteChildElement);

        return absoluteChildElement.offsetWidth
            + parseInt(aboluteElementStyle.marginRight)
            + parseInt(aboluteElementStyle.marginLeft);
    }

    getRightExtreme(): number {
        const relativeElementStyle: CSSStyleDeclaration = window.getComputedStyle(this.relativeElement);

        return -Math.abs
        (
            this.absoluteElement.offsetWidth + this.inicialPosition
            - (
                this.relativeElement.offsetWidth
                - parseInt(relativeElementStyle.paddingRight)
                - parseInt(relativeElementStyle.paddingLeft)
            )
        );
    }

    onClick(mouseEvent: MouseEvent): void {
        if(this.clickToMove) {
            const selectedElement: HTMLElement = this.absoluteElement.children[this.selectedIndex] as HTMLElement;
            if(selectedElement !== mouseEvent.target as HTMLElement && !this.mouseMoved) {
                this.goToElement(mouseEvent.target as HTMLElement);
            }

            this.mouseMoved = false;
        }
    }

    onMouseDown(e: MouseEvent): void {
        if(this.transitionEnded) {
            this.transitionEnded = false;
            this.changeFinalPosition = false;
            this.absoluteElement.style.transitionDuration = "0ms";
            this.firstClickValue = e.clientX;
            this.dragged = true;
            document.onmousemove = this.onMouseMove;
            document.onmouseup = this.onMouseUp;

            this.$emit("stop-slider-interval");
        }
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        this.relativeElement.style.cursor = "grabbing";
        this.mouseMoved = true;

        if(this.finalPosition) {
            this.translateX(this.finalPosition + (mouseEvent.clientX - this.firstClickValue));
            this.selectedItemIndex = Math.round((this.inicialPosition - (this.finalPosition + (mouseEvent.clientX - this.firstClickValue))) / this.childElementWidth);
        } else {
            this.translateX(this.finalPosition + this.inicialPosition + (mouseEvent.clientX - this.firstClickValue));
            this.selectedItemIndex = Math.round((this.finalPosition + (this.firstClickValue - mouseEvent.clientX)) / this.childElementWidth);
        }

        this.checkExtremes(mouseEvent);

        this.$emit("activity-carousel-mouse-moving", mouseEvent.clientX - this.firstClickValue, this.selectedItemIndex);
    }

    move(value: number): void {
        if(!this.mousePosition) {
            this.mousePosition = this.getTranslateX(this.absoluteElement);
        }
        this.translateX(this.mousePosition + value);
    }

    onMouseUp(): void {
        document.onmousemove = null;
        document.onmouseup = null;

        if(this.mouseMoved) {
            this.mouseMoved = false;
            this.relativeElement.style.cursor = "not-allowed";
            this.absoluteElement.style.pointerEvents = "none";
            this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";
            this.changeFinalPosition = true;
            const translateX: number = this.getTranslateX(this.absoluteElement);
            this.enterExtremeValue = 0;

            if(this.isExtremeLeft(translateX)) {
                this.translateX(this.inicialPosition);
                this.transitionEnded = true;
                this.$emit("activity-carousel-mouse-up", 0);
            }
            else if(this.isExtremeRight(translateX)) {
                this.translateX(this.rightExtreme);
                this.transitionEnded = true;
                this.$emit("activity-carousel-mouse-up", this.absoluteElement.children.length - 1);
            } else {
                const closestElementPosition: number = this.getClosestAlignedElementPosition();
                if (closestElementPosition >= this.rightExtreme) {
                    this.translateX(closestElementPosition);
                    this.$emit("activity-carousel-mouse-up", (this.inicialPosition - closestElementPosition) / this.childElementWidth);
                }
            }

            this.$emit("disable-arrow");
        } else {
            this.transitionEnded = true;
        }
    }

    alignItems(index: number): void {
        const translateX: number = this.getTranslateX(this.absoluteElement);
        if (translateX - this.inicialPosition % this.childElementWidth != 0) {
            this.translateX(translateX - ((this.childElementWidth * index) - (this.inicialPosition - translateX)));
        } else {
            this.translateX(this.inicialPosition - (this.childElementWidth * index));
        }
        this.mousePosition = 0;
    }

    getClosestAlignedElementPosition(): number {
        const position: number = this.childElementWidth * Math.round((this.getTranslateX(this.absoluteElement) + this.leftMargin) / this.childElementWidth);
        const rest: number = (this.childElementWidth * Math.round((this.relativeElement.offsetWidth / 2) / this.childElementWidth)) - this.inicialPosition;

        if(position - rest === this.getTranslateX(this.absoluteElement)) {
            this.didntAlign = true;
        }

        return this.inicialPosition ? position - rest : position;
    }

    nextItem(): void {
        if(this.transitionEnded) {
            this.transitionEnded = false;
            this.changeFinalPosition = true;
            this.relativeElement.style.cursor = "not-allowed";
            this.absoluteElement.style.pointerEvents = "none";
            const translateX: number = this.getTranslateX(this.absoluteElement);

            if(translateX === this.rightExtreme){
                this.translateX(this.inicialPosition);
            } else if(this.nextMoveIsExtremeRight()) {
                const excededValue: number = (translateX - this.childElementWidth) - this.rightExtreme;
                this.inicialPosition ? this.translateX(this.inicialPosition) : this.translateX(translateX - (this.childElementWidth + excededValue));
            } else {
                this.translateX(translateX - this.childElementWidth);
            }

            this.$emit("disable-arrow");
        }
    }

    nextMoveIsExtremeRight(): boolean {
        return this.getTranslateX(this.absoluteElement) - this.childElementWidth < this.rightExtreme;
    }

    previousItem(): void {
        if(this.transitionEnded) {
            this.transitionEnded = false;
            this.changeFinalPosition = true;
            this.relativeElement.style.cursor = "not-allowed";
            this.absoluteElement.style.pointerEvents = "none";
            const translateX: number = this.getTranslateX(this.absoluteElement);

            if(this.isNotAligned() && !this.inicialPosition) {
                const excededValue: number = this.childElementWidth
                                * Math.abs
                                (
                                    Math.ceil(translateX / this.childElementWidth)
                                )
                                + this.childElementWidth * (translateX / this.childElementWidth);

                this.translateX(translateX - excededValue);

            } else if(this.nextMoveIsExtremeLeft()) {
                this.translateX(this.rightExtreme);
            } else if(translateX === this.inicialPosition) {
                this.translateX(this.rightExtreme);
            } else {
                this.translateX(translateX + this.childElementWidth);
            }

            this.$emit("disable-arrow");
        }
    }

    nextMoveIsExtremeLeft(): boolean {
        return this.getTranslateX(this.absoluteElement) + this.childElementWidth > this.inicialPosition;
    }

    isNotAligned(): boolean {
        const translateX: number = this.getTranslateX(this.absoluteElement);
        return translateX % this.childElementWidth != 0;
    }

    goToElement(element: HTMLElement): void {
        document.onmouseup = null;
        document.onmousemove = null;
        this.transitionEnded = false;
        this.changeFinalPosition = true;
        this.relativeElement.style.cursor = "not-allowed";
        this.absoluteElement.style.pointerEvents = "none";
        this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";

        const translateX: number = this.getTranslateX(this.absoluteElement);

        if (this.ifJumpIsHigherThanRightExtreme(element) && !this.inicialPosition) {
            this.translateX(this.rightExtreme);
        } else if(!this.isInitialPosition()) {
            this.translateX(translateX - (element.offsetLeft + translateX) + this.inicialPosition);
        } else {
            this.translateX(-element.offsetLeft + this.inicialPosition);
        }

        const selected: number = element.offsetLeft / this.childElementWidth;

        this.$emit("selected-changed", selected);
        this.$emit("disable-arrow");
    }

    selectedChanged(position: number): void {
        this.changeFinalPosition = true;
        this.absoluteElement.style.transitionDuration = "0ms";
        this.finalPosition ? this.translateX(this.finalPosition + position) : this.translateX(this.inicialPosition + position);
    }

    AlignByIndex(index: number): void {
        this.changeFinalPosition = true;

        this.relativeElement.style.cursor = "not-allowed";
        this.absoluteElement.style.pointerEvents = "none";
        this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";

        this.translateX(this.inicialPosition - (index * this.childElementWidth));
    }

    ifJumpIsHigherThanRightExtreme(element: HTMLElement): boolean {
        return this.rightExtreme > this.getTranslateX(this.absoluteElement) - (element.offsetLeft + this.getTranslateX(this.absoluteElement));
    }

    isInitialPosition(): boolean {
        return this.getTranslateX(this.absoluteElement) === this.inicialPosition;
    }

    checkExtremes(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        const translateX: number = this.getTranslateX(this.absoluteElement);
        this.getExtremeValue(mouseEvent);
        this.getSelectedItemIndexInExtremes(this.enterExtremeValue);

        if(this.isExtremeLeft(translateX)) {
            this.translateX(((mouseEvent.clientX - this.enterExtremeValue) * 0.1) + this.inicialPosition);
            this.isExtreme = true;
        } else if(this.isExtremeRight(translateX)) {
            this.translateX((mouseEvent.clientX - this.enterExtremeValue) * 0.1 + this.rightExtreme);
            this.isExtreme = true;
        } else {
            this.isExtreme = false;
            this.enterExtremeValue = 0;
        }
    }

    getSelectedItemIndexInExtremes(enterExtremeValue: number): void {
        if(this.finalPosition) {
            this.selectedItemIndex = Math.round((this.inicialPosition - (this.finalPosition + (enterExtremeValue - this.firstClickValue))) / this.childElementWidth);
        } else {
            this.selectedItemIndex = Math.round((this.finalPosition + (this.firstClickValue - enterExtremeValue)) / this.childElementWidth);
        }
    }

    getExtremeValue(mouseEvent: MouseEvent): void {
        if (!this.enterExtremeValue){
            this.enterExtremeValue = mouseEvent.clientX;
        }
    }

    getTranslateX(element: HTMLElement): number {
        const style: CSSStyleDeclaration = window.getComputedStyle(element);
        const matrix: DOMMatrixReadOnly = new DOMMatrixReadOnly(style.transform);
        return matrix.m41;
    }

    translateX(value: number): void {
        if((this.$el as HTMLElement).firstElementChild) {
            ((this.$el as HTMLElement).firstElementChild as HTMLElement).style.transform = `translateX(${value}px)`;
        }
        if (this.isExtremeLeft(value)) {
            this.disablePreviousButton = true;
            this.disableNextButton = false;
        } else if (this.isExtremeRight(value)) {
            this.disableNextButton = true;
            this.disablePreviousButton = false;
        } else {
            this.disableNextButton = false;
            this.disablePreviousButton = false;
        }
    }

    isExtremeLeft(value: number): boolean {
        return value >= this.inicialPosition;
    }

    isExtremeRight(value: number): boolean {
        return value <= this.rightExtreme;
    }
}
