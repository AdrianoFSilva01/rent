import SelectedPositionCarousel from "@/Components/Carousel/SelectedPosition";
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
        'update:modelValue',
        "carousel-onmousemove",
        "disable-arrow",
        "enable-arrow"
    ]
})
export default class Carousel extends Vue {
    @ModelSync('nextButton', 'update:nextButton') disableNextButton: boolean = false;
    @ModelSync('previousButton', 'update:previousButton') disablePreviousButton: boolean = false;
    @ModelSync('modelValue', 'update:modelValue') selectedIndex!: number;

    @Prop({default: SelectedPositionCarousel.left}) selectedPosition!: SelectedPositionCarousel;
    @Prop({default: false}) clickToMove!: boolean;

    relativeElement!: HTMLElement;
    absoluteElement!: HTMLElement;
    inicialPosition: number = 0;
    childElementWidth: number = 0;

    onMouseDownClientX: number = 0;
    selectedIndexClientX: number = 0;
    extremeClientX: number = 0;
    rightExtremeClientX: number = 0;

    transitionEnded: boolean = true;
    mouseMoved: boolean = false;
    transitionDuration: number = 0;

    //Po lixo
    selectedChangedEnterIndex: number = -1;
    onMouseDownMillisecond: number = 0;
    onMouseUpMillisecond: number = 0;
    addSliderInterval: boolean = false;

    mounted(): void {
        this.transitionDuration = parseFloat(window.getComputedStyle(this.$el).transitionDuration);
        this.relativeElement = this.$el as HTMLElement;
        this.absoluteElement = (this.$el as HTMLElement).firstElementChild as HTMLElement;
        this.disablePreviousButton = true;
        this.childElementWidth = this.getChildElementWidth();

        if(this.selectedPosition === SelectedPositionCarousel.middle) {
            this.inicialPosition = this.relativeElement.offsetWidth / 2 - this.childElementWidth / 2;
        }
        this.translateX = this.inicialPosition;

        this.rightExtremeClientX = this.getRightExtreme();

        this.relativeElement.style.cursor = "grab";
        this.absoluteElement.style.transitionProperty = "all";
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
        if(this.clickToMove && !this.mouseMoved) {
            const selectedElement: HTMLElement = this.absoluteElement.children[this.selectedIndex] as HTMLElement;
            if(selectedElement !== mouseEvent.target as HTMLElement && (mouseEvent.target as HTMLElement).parentNode === this.absoluteElement) {
                this.goToElement(mouseEvent.target as HTMLElement);
            } else {
                this.addTransition();
                this.onMouseUpMillisecond = (new Date().getMinutes() * 60000) + (new Date().getSeconds() * 1000) + new Date().getMilliseconds();

                const clickWasFasterThanIntervalTransition: boolean = this.onMouseUpMillisecond - this.onMouseDownMillisecond < this.transitionDuration * 1000;

                if(clickWasFasterThanIntervalTransition) {
                    setTimeout(() => {
                        this.afterTransition();
                        this.$emit("add-slider-interval");
                    }, (this.transitionDuration * 1000) - (this.onMouseUpMillisecond - this.onMouseDownMillisecond));
                } else {
                    this.afterTransition();
                    this.$emit("add-slider-interval");
                }
            }
        } else {
            this.afterTransition();
        }
    }

    onMouseDown(e: MouseEvent): void {
        if(this.transitionEnded) {
            this.removeTransition();
            this.onMouseDownClientX = e.clientX;
            this.extremeClientX = 0;
            document.onmousemove = this.onMouseMove;
            document.onmouseup = this.onMouseUp;

            this.onMouseDownMillisecond = (new Date().getMinutes() * 60000) + (new Date().getSeconds() * 1000) + new Date().getMilliseconds();
            this.$emit("stop-slider-interval");
        }
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();

        mouseEvent.clientX !== this.onMouseDownClientX
            ? this.mouseMoved = true
            : this.mouseMoved = false;

        let selectedItem: number = 0;

        if(this.selectedIndexClientX) {
            this.translateX = this.selectedIndexClientX + (mouseEvent.clientX - this.onMouseDownClientX);
            selectedItem = Math.round((this.inicialPosition - (this.selectedIndexClientX + (mouseEvent.clientX - this.onMouseDownClientX))) / this.childElementWidth);
        } else {
            this.translateX = this.inicialPosition + (mouseEvent.clientX - this.onMouseDownClientX);
            selectedItem = Math.round((this.selectedIndexClientX + (this.onMouseDownClientX - mouseEvent.clientX)) / this.childElementWidth);
        }

        this.checkExtremes(mouseEvent);

        if(selectedItem < 0) {
            this.selectedIndex = 0
        } else if(selectedItem > this.absoluteElement.children.length - 1) {
            this.selectedIndex = this.absoluteElement.children.length - 1;
        } else {
            this.selectedIndex = selectedItem;
        }

        const percentageMoved: number = ((this.inicialPosition - this.getTranslateX()) / ((this.absoluteElement.children.length - 1) * this.childElementWidth)) * 100

        this.$emit("activity-carousel-mouse-moving", percentageMoved);
    }

    onMouseUp(mouseEvent: MouseEvent): void {
        document.onmousemove = null;
        document.onmouseup = null;

        if(this.mouseMoved) {
            this.mouseMoved = false;
            this.addTransition();
            const translateX: number = this.getTranslateX();
            const noOpacityChanges: boolean = Math.abs(((translateX - this.inicialPosition)) / this.childElementWidth) % 1 === 0;
            const selectedElementClientX: number = this.inicialPosition - this.selectedIndex * this.childElementWidth;

            if(noOpacityChanges) {
                this.afterTransition();
            } else if(selectedElementClientX < this.rightExtremeClientX) {
                const excededValue: number = (translateX - this.childElementWidth) - this.rightExtremeClientX;
                this.translateX = translateX - ((this.childElementWidth + excededValue));
            } else {
                this.translateX = selectedElementClientX;
            }

            this.$emit("activity-carousel-mouse-up");
            this.$emit("disable-arrow");
        } else {
            this.onClick(mouseEvent);
        }
    }

    nextItem(): void {
        if(this.transitionEnded) {
            this.addTransition();
            const translateX: number = this.getTranslateX();

            if(translateX === this.rightExtremeClientX){
                this.translateX = this.inicialPosition;
                this.selectedIndex = 0;
            } else if(this.nextMoveIsRightExtreme()) {
                const excededValue: number = (translateX - this.childElementWidth) - this.rightExtremeClientX;
                this.inicialPosition ? this.translateX = this.inicialPosition : this.translateX = translateX - (this.childElementWidth + excededValue);
                this.selectedIndex = ((this.childElementWidth + excededValue) - translateX) / this.childElementWidth;
            } else {
                this.translateX = translateX - this.childElementWidth;
                this.selectedIndex = ((this.inicialPosition - translateX) / this.childElementWidth) + 1;
            }

            this.$emit("disable-arrow");
        }
    }

    nextMoveIsRightExtreme(): boolean {
        return this.getTranslateX() - this.childElementWidth < this.rightExtremeClientX;
    }

    previousItem(): void {
        if(this.transitionEnded) {
            this.addTransition();
            const translateX: number = this.getTranslateX();

            if(this.isNotAligned() && !this.inicialPosition) {
                const excededValue: number = this.childElementWidth
                                * Math.abs
                                (
                                    Math.ceil(translateX / this.childElementWidth)
                                )
                                + this.childElementWidth * (translateX / this.childElementWidth);

                this.translateX = translateX - excededValue;
                this.selectedIndex = (excededValue - translateX) / this.childElementWidth;
            } else if(this.nextMoveIsExtremeLeft()) {
                this.translateX = this.rightExtremeClientX;
                this.selectedIndex = this.absoluteElement.children.length - 1;
            } else {
                this.translateX = translateX + this.childElementWidth;
                this.selectedIndex = ((this.inicialPosition - translateX) / this.childElementWidth) - 1;
            }

            this.$emit("disable-arrow");
        }
    }

    nextMoveIsExtremeLeft(): boolean {
        return this.getTranslateX() + this.childElementWidth > this.inicialPosition;
    }

    isNotAligned(): boolean {
        const translateX: number = this.getTranslateX();
        return translateX % this.childElementWidth != 0;
    }

    goToElement(element: HTMLElement): void {
        document.onmouseup = null;
        document.onmousemove = null;
        this.addTransition();

        if(this.ifJumpIsHigherThanRightExtreme(element) && !this.inicialPosition) {
            this.translateX = this.rightExtremeClientX;
            this.selectedIndex = this.absoluteElement.children.length - 1;
        } else {
            this.translateX = -((element.offsetLeft) - this.inicialPosition);
            this.selectedIndex = element.offsetLeft / this.childElementWidth;
        }

        this.$nextTick(() => {
            this.$emit("selected-changed");
        });
        this.$emit("disable-arrow");
    }

    selectedChanging(percentageMoved: number): void {
        this.mouseMoved = true;
        if(Math.abs(percentageMoved) < 100) {
            const pixelsToMove: number = (percentageMoved / 100) * this.childElementWidth;
            const selectedClientX: number = this.selectedIndexClientX
                ? this.selectedIndexClientX
                : this.inicialPosition;
            const translateX: number = selectedClientX + pixelsToMove;

            this.translateX = translateX;
        }
    }

    selectedChanged(): void {
        this.addTransition();
        this.mouseMoved = false;
        this.translateX = -((this.selectedIndex * this.childElementWidth) - this.inicialPosition);
        this.afterTransition();
    }

    ifJumpIsHigherThanRightExtreme(element: HTMLElement): boolean {
        return this.rightExtremeClientX > this.getTranslateX() - (element.offsetLeft + this.getTranslateX());
    }

    checkExtremes(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        const translateX: number = this.getTranslateX();
        this.setExtremeValue(mouseEvent);

        if(this.isExtremeLeft(translateX)) {
            this.translateX = ((mouseEvent.clientX - this.extremeClientX) * 0.1) + this.inicialPosition;
        } else if(this.isExtremeRight(translateX)) {
            this.translateX = (mouseEvent.clientX - this.extremeClientX) * 0.1 + this.rightExtremeClientX;
        } else {
            this.extremeClientX = 0;
        }
    }

    setExtremeValue(mouseEvent: MouseEvent): void {
        if (!this.extremeClientX){
            this.extremeClientX = mouseEvent.clientX;
        }
    }

    getTranslateX(): number {
        const style: CSSStyleDeclaration = window.getComputedStyle(this.absoluteElement);
        const matrix: DOMMatrixReadOnly = new DOMMatrixReadOnly(style.transform);
        return matrix.m41;
    }

    set translateX(value: number) {
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
        return value <= this.rightExtremeClientX;
    }

    addTransition(): void {
        this.transitionEnded = false;
        this.relativeElement.style.cursor = "not-allowed";
        document.getElementsByTagName("body")[0].style.cursor = "default";
        this.absoluteElement.style.pointerEvents = "none";
        this.absoluteElement.style.transitionDuration = this.transitionDuration + "s";
    }

    removeTransition(): void {
        this.transitionEnded = false;
        this.relativeElement.style.cursor = "grabbing";
        document.getElementsByTagName("body")[0].style.cursor = "grabbing";
        this.absoluteElement.style.pointerEvents = "auto";
        this.absoluteElement.style.transitionDuration = "0ms";
    }

    afterTransition(): void {
        this.transitionEnded = true;
        this.selectedIndexClientX = this.getTranslateX();
        this.selectedChangedEnterIndex = -1;
        this.relativeElement.style.cursor = "grab";
        this.absoluteElement.style.pointerEvents = "auto";
        document.getElementsByTagName("body")[0].style.cursor = "default";
        this.absoluteElement.style.transitionDuration = "0ms";
        this.$emit("enable-arrow", this.disableNextButton, this.disablePreviousButton);

        //Pah vamos ver V.2
        if(this.addSliderInterval) {
            this.$emit("add-slider-interval");
            this.addSliderInterval = false;
        }
    }
}
