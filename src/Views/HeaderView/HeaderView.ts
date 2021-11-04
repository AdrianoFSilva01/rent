import HamburgerMenu from "@/Components/HamburgerMenu/HamburgerMenu.vue";
import UnderlineTextAnimated from "@/Components/UnderlineTextAnimated/UnderlineTextAnimated.vue";
import WaveButton from "@/Components/WaveButton/WaveButton.vue";
import { Options, Vue } from "vue-class-component";
import { ModelSync } from "vue-property-decorator";

@Options({
    components:{
        HamburgerMenu,
        UnderlineTextAnimated,
        WaveButton
    },
    emits: ["display-overlay", "update:modelValue"]
})
export default class HeaderView extends Vue {
    @ModelSync('modelValue', 'update:modelValue') scrollToTop!: boolean;

    element: HTMLElement | undefined = undefined;
    elementHeight: number = 0;
    elementPadding: number = 10;
    elementBorder: number = 2;
    marginToShow: number = 100;
    scrollPosition: number = 0;
    scrollPositionWithMargin: number = 0;

    mounted(): void {
        this.element = (this.$el as HTMLElement);
        this.scrollPosition = window.scrollY;
        this.elementHeight = this.element.offsetHeight +
            parseInt(window.getComputedStyle(this.element).marginTop) +
            parseInt(window.getComputedStyle(this.element).marginBottom);

        window.addEventListener("scroll", () => {
            if(this.element) {
                if(window.scrollY <= this.scrollPosition) {
                    if(this.scrollPositionWithMargin === 0) {
                        this.scrollPositionWithMargin = window.scrollY - this.marginToShow;
                    }

                    if(this.scrollPositionWithMargin >= this.scrollPosition) {
                        if(window.scrollY <= this.elementHeight * 2) {
                            const scrollPercentageConverted: number = (window.scrollY / (this.elementHeight * 2));

                            if(window.scrollY === 0) {
                                this.element.classList.remove("sticky");
                                this.scrollToTop = false;
                            }

                            this.element.classList.remove("border-b-2", "border-gold");
                            this.element.style.transitionProperty = "border";

                            this.element.style.paddingTop = `${this.elementPadding * scrollPercentageConverted}px`;
                            this.element.style.paddingBottom = `${this.elementPadding * scrollPercentageConverted}px`;
                        } else {
                            this.element.classList.add("sticky", "border-b-2", "border-gold");

                            this.element.style.transitionProperty = "all";

                            this.element.style.paddingTop = `${this.elementPadding}px`;
                            this.element.style.paddingBottom = `${this.elementPadding}px`;

                            if(this.scrollToTop) {
                                this.element.classList.replace("top-0", "-top-full");
                                this.element.classList.remove("border-b-2", "border-gold");
                            } else {
                                this.element.classList.replace("-top-full", "top-0");
                            }

                        }
                    }

                } else {
                    this.scrollPositionWithMargin = 0;

                    this.element.classList.replace("top-0", "-top-full");

                    this.element.style.transitionProperty = "all";
                }

                this.scrollPosition = window.scrollY;
            }
        });
    }

    displayOverlay(): void {
        this.$emit("display-overlay");
    }

    backToTop(): void {
        document.documentElement.scrollTop = 0;
        if(window.scrollY !== 0) {
            this.scrollToTop = true;
        }
    }
}