import { debounce, DebouncedFunction, Procedure } from 'ts-debounce';
import { Options, Vue } from "vue-class-component";
import { ModelSync, Ref } from "vue-property-decorator";

@Options({
    emits: ['update:nextButton', 'update:previousButton']
})
export default class Carousel extends Vue{
    @ModelSync('nextButton', 'update:nextButton') disableNextButton: boolean = false;
    @ModelSync('previousButton', 'update:previousButton') disablePreviousButton: boolean = false;
    @Ref() relativeElement!: HTMLElement;
    @Ref() absoluteElement!: HTMLElement;

    childElementWidth: number = 0;
    firstClickValue: number = 0;
    finalPosition: number = 0;
    enterExtremeValue: number = 0;
    rightExtreme: number = 0;
    leftMargin: number = 0;
    debouncedFunction!: DebouncedFunction<Procedure>;

    mounted(): void {
        this.leftMargin = this.absoluteElement.offsetLeft;
        this.disablePreviousButton = true;
        this.childElementWidth = this.getChildElementWidth();
        this.rightExtreme = this.getRightExtreme();
        this.debouncedFunction = debounce(this.onTransitionEnded, 200);
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
            this.absoluteElement.offsetWidth
            - (
                this.relativeElement.offsetWidth
                - parseInt(relativeElementStyle.paddingRight)
                - parseInt(relativeElementStyle.paddingLeft)
            )
        );
    }

    onClick(e: MouseEvent): void {
        this.firstClickValue = e.clientX;
        this.absoluteElement.style.cursor = "grabbing";
        document.onmouseup = this.onMouseUp;
        document.onmousemove = this.onMouseMove;
    }

    onMouseMove(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        this.translateX(this.finalPosition + (mouseEvent.clientX - this.firstClickValue));
        this.checkExtremes(mouseEvent);
    }

    onMouseUp(): void {
        document.onmousemove = null;
        this.absoluteElement.style.cursor = "grab"
        const translateX: number = this.getTranslateX(this.absoluteElement);
        this.setTransitionDuration();
        this.enterExtremeValue = 0;

        if(this.isExtremeLeft(translateX)) {
            this.translateX(0);
        }
        else if(this.isExtremeRight(translateX)) {
            this.translateX(this.rightExtreme);
        } else {
            const closestElementPosition: number = this.getClosestAlignedElementPosition();
            if (closestElementPosition >= this.rightExtreme) {
                this.translateX(closestElementPosition);
            }
        }
    }

    getClosestAlignedElementPosition(): number {
        return this.childElementWidth * Math.round((this.getTranslateX(this.absoluteElement) + this.leftMargin) / this.childElementWidth);
    }

    nextSlider(): void {
        this.setTransitionDuration();
        const translateX: number = this.getTranslateX(this.absoluteElement);

        if(this.nextMoveIsExtremeRight()) {
            const excededValue: number = (translateX - this.childElementWidth) - this.rightExtreme;
            this.translateX(translateX - (this.childElementWidth + excededValue));
        } else {
            this.translateX(translateX - this.childElementWidth);
        }
    }

    nextMoveIsExtremeRight(): boolean {
        return this.getTranslateX(this.absoluteElement) - this.childElementWidth < this.rightExtreme;
    }

    previousSlider(): void {
        this.setTransitionDuration();
        const translateX: number = this.getTranslateX(this.absoluteElement);

        if(this.isNotAligned()) {
            const excededValue: number = this.childElementWidth
                * Math.abs
                (
                    Math.ceil(translateX / this.childElementWidth)
                )
                + this.childElementWidth * (translateX / this.childElementWidth);

            this.translateX(translateX - excededValue);
        }
        else {
            this.translateX(translateX + this.childElementWidth);
        }
    }

    isNotAligned(): boolean {
        return this.getTranslateX(this.absoluteElement) % this.childElementWidth != 0
    }

    jumpSliders(element: HTMLElement): void {
        this.setTransitionDuration();
        const translateX: number = this.getTranslateX(this.absoluteElement);

        if (this.ifJumpIsHigherThanRightExtreme(element)) {
            this.translateX(this.rightExtreme);
        } else if(!this.isInitialPosition()) {
            this.translateX(translateX - (element.offsetLeft + translateX));
        } else {
            this.translateX(-element.offsetLeft);
        }
    }

    ifJumpIsHigherThanRightExtreme(element: HTMLElement): boolean {
        return this.rightExtreme > this.getTranslateX(this.absoluteElement) - (element.offsetLeft + this.getTranslateX(this.absoluteElement))
    }

    isInitialPosition(): boolean {
        return this.getTranslateX(this.absoluteElement) === 0;
    }

    checkExtremes(mouseEvent: MouseEvent): void {
        mouseEvent.preventDefault();
        const translateX: number = this.getTranslateX(this.absoluteElement);
        this.getExtremeValue(mouseEvent);

        if(this.isExtremeLeft(translateX)) {
            this.translateX((mouseEvent.clientX - this.enterExtremeValue) * 0.1);
        } else if(this.isExtremeRight(translateX)) {
            this.translateX((mouseEvent.clientX - this.enterExtremeValue) * 0.1 + this.rightExtreme);
        } else {
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
        this.absoluteElement.style.transform = `translateX(${value}px)`;
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
        return value >= 0;
    }

    isExtremeRight(value: number): boolean {
        return value <= this.rightExtreme;
    }

    setTransitionDuration(): void {
        this.absoluteElement.style.transitionDuration = "200ms";
        this.debouncedFunction();
    }

    onTransitionEnded(): void {
        this.absoluteElement.style.transitionDuration = "0ms";
        this.finalPosition = this.getTranslateX(this.absoluteElement);
    }
}
