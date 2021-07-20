import { DebouncedFunction, Procedure } from 'ts-debounce';
import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop } from "vue-property-decorator";

@Options({
    emits: [
        "stop-slider-interval",
        "add-slider-interval",
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
export default class Carousel extends Vue {
    @ModelSync('nextButton', 'update:nextButton') disableNextButton: boolean = false;
    @ModelSync('previousButton', 'update:previousButton') disablePreviousButton: boolean = false;
    @ModelSync('beingDragged', 'update:beingDragged') dragged: boolean = false;
    @ModelSync('modelValue', 'update:modelValue') selectedItemIndex!: number;
    @ModelSync('isCarouselExtreme', 'update:isCarouselExtreme') isExtreme: boolean = false;

    @Prop({default: 0}) selectedPosition!: number;
    @Prop({default: false}) clickToMove!: boolean;

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
    changeFinalPosition: boolean = false;
    transitionDuration: number = 0;
    selectedChangedEnterIndex: number = -1;
    onMouseDownMillisecond: number = 0;
    onMouseUpMillisecond: number = 0;
    addInterval: boolean = false;

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
                this.mouseMoved = false;
                this.relativeElement.style.cursor = "grab";
                this.absoluteElement.style.pointerEvents = "auto";
                this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";
                this.transitionEnded = true;
                this.changeFinalPosition = false;
                this.finalPosition = this.getTranslateX(this.absoluteElement);
                this.selectedChangedEnterIndex = -1;
                if(this.addInterval) {
                    this.$emit("add-slider-interval");
                    this.addInterval = false;
                }
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
            const selectedElement: HTMLElement = this.absoluteElement.children[this.selectedItemIndex] as HTMLElement;
            if(selectedElement !== mouseEvent.target as HTMLElement && !this.mouseMoved) {
                this.goToElement(mouseEvent.target as HTMLElement);
            } else {
                this.transitionEnded = true;
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

            this.onMouseDownMillisecond = (new Date().getMinutes() * 60000) + (new Date().getSeconds() * 1000) + new Date().getMilliseconds();
            this.$emit("stop-slider-interval");
        }
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        this.relativeElement.style.cursor = "grabbing";
        this.mouseMoved = true;

        let selectedItemRounded: number = 0;

        if(this.finalPosition) {
            this.translateX(this.finalPosition + (mouseEvent.clientX - this.firstClickValue));
            selectedItemRounded = Math.round((this.inicialPosition - (this.finalPosition + (mouseEvent.clientX - this.firstClickValue))) / this.childElementWidth);
            this.selectedItemIndex = selectedItemRounded;
        } else {
            this.translateX(this.finalPosition + this.inicialPosition + (mouseEvent.clientX - this.firstClickValue));
            selectedItemRounded = Math.round((this.finalPosition + (this.firstClickValue - mouseEvent.clientX)) / this.childElementWidth);
            this.selectedItemIndex = selectedItemRounded;
        }

        this.checkExtremes(mouseEvent);

        if(selectedItemRounded < 0) {
            selectedItemRounded = 0
        } else if(selectedItemRounded > this.absoluteElement.children.length - 1) {
            selectedItemRounded = this.absoluteElement.children.length - 1;
        }

        this.$emit("activity-carousel-mouse-moving", this.inicialPosition - this.getTranslateX(this.absoluteElement), selectedItemRounded);
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
            this.relativeElement.style.cursor = "not-allowed";
            this.absoluteElement.style.pointerEvents = "none";
            this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";
            this.changeFinalPosition = true;
            const translateX: number = this.getTranslateX(this.absoluteElement);
            this.enterExtremeValue = 0;

            if(Math.abs(((this.getTranslateX(this.absoluteElement) - this.inicialPosition)) / this.childElementWidth) % 1 === 0) {
                this.transitionEnded = true;
                this.relativeElement.style.cursor = "grab";
                this.absoluteElement.style.pointerEvents = "auto";
                this.$emit("add-slider-interval");
            } else if(this.isExtremeLeft(translateX)) {
                this.selectedItemIndex = 0;
                this.addInterval = true;
                this.translateX(this.inicialPosition);
                this.$emit("activity-carousel-mouse-up", 0);
            } else if(this.isExtremeRight(translateX)) {
                this.selectedItemIndex = this.absoluteElement.children.length - 1;
                this.addInterval = true;
                this.translateX(this.rightExtreme);
                this.$emit("activity-carousel-mouse-up", this.absoluteElement.children.length - 1);
            } else {
                const closestElementPosition: number = this.getClosestAlignedElementPosition();
                if (closestElementPosition >= this.rightExtreme) {
                    this.selectedItemIndex = (this.inicialPosition - closestElementPosition) / this.childElementWidth;
                    this.translateX(closestElementPosition);
                    this.$emit("activity-carousel-mouse-up", (this.inicialPosition - closestElementPosition) / this.childElementWidth);
                }
            }

            this.$emit("disable-arrow");
        } else {
            this.transitionEnded = true;
            this.onMouseUpMillisecond = (new Date().getMinutes() * 60000) + (new Date().getSeconds() * 1000) + new Date().getMilliseconds();

            if(this.onMouseUpMillisecond - this.onMouseDownMillisecond < this.transitionDuration * 1000) {
                setTimeout(() => {
                    this.$emit("add-slider-interval");
                }, (this.transitionDuration * 1000) - (this.onMouseUpMillisecond - this.onMouseDownMillisecond));
            } else {
                this.$emit("add-slider-interval");
            }
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
                this.selectedItemIndex = 0;
                this.translateX(this.inicialPosition);
            } else if(this.nextMoveIsExtremeRight()) {
                const excededValue: number = (translateX - this.childElementWidth) - this.rightExtreme;
                this.inicialPosition ? this.translateX(this.inicialPosition) : this.translateX(translateX - (this.childElementWidth + excededValue));
                this.selectedItemIndex = Math.round(((this.childElementWidth + excededValue) - translateX) / this.childElementWidth);
            } else {
                this.selectedItemIndex = ((this.inicialPosition - translateX) / this.childElementWidth) + 1;
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

                this.selectedItemIndex = (excededValue - translateX) / this.childElementWidth;
                this.translateX(translateX - excededValue);
            } else if(this.nextMoveIsExtremeLeft()) {
                this.selectedItemIndex = this.absoluteElement.children.length - 1;
                this.translateX(this.rightExtreme);
            } else {
                this.selectedItemIndex = ((this.inicialPosition - translateX) / this.childElementWidth) - 1;
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
        this.selectedItemIndex = selected;


        this.$emit("selected-changed", selected);
        this.$emit("disable-arrow");
    }

    selectedChanged(position: number, changeOpacityMargin: number): void {
        if(this.selectedChangedEnterIndex < 0) {
            this.selectedChangedEnterIndex = this.selectedItemIndex;
        }

        if(position > changeOpacityMargin) {
            if(this.selectedChangedEnterIndex === 0) {
                this.selectedItemIndex = this.absoluteElement.children.length - 1;
            } else {
                this.selectedItemIndex = this.selectedChangedEnterIndex - 1;
            }
        } else if(position < -changeOpacityMargin) {
            if(this.selectedChangedEnterIndex === this.absoluteElement.children.length - 1) {
                this.selectedItemIndex = 0;
            } else {
                this.selectedItemIndex = this.selectedChangedEnterIndex + 1;
            }
        } else {
            this.selectedItemIndex = this.selectedChangedEnterIndex;
        }

        this.changeFinalPosition = true;
        this.absoluteElement.style.transitionDuration = "0ms";
        this.finalPosition ? this.translateX(this.finalPosition + position) : this.translateX(this.inicialPosition + position);
    }

    AlignByIndex(index: number): void {
        this.changeFinalPosition = true;

        this.relativeElement.style.cursor = "not-allowed";
        this.absoluteElement.style.pointerEvents = "none";
        this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";

        this.selectedItemIndex = index;
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
