import { Options, Vue } from "vue-class-component";

@Options({
    emits: [
        "scroll-to-top"
    ]
})
export default class OverlayView extends Vue {
    show: boolean = false;
    transitionEnded: boolean = false;
    transitionDelay: boolean = true;

    toogleDisplay(): void {
        this.show = !this.show;

        if(this.show) {
            this.transitionDelay = true;
            document.getElementsByTagName("html")[0].style.overflow = "hidden";
        } else {
            document.getElementsByTagName("html")[0].style.overflow = "visible";
        }
    }

    changeDelay(): void {
        this.transitionDelay = false;
    }

    backToTop(): void {
        document.documentElement.scrollTop = 0;
        if(window.scrollY !== 0) {
            this.$emit("scroll-to-top");
        }
    }
}