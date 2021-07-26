import { Vue } from "vue-class-component";

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
            document.getElementsByTagName("html")[0].style.overflowY = "visible";
        }
    }

    changeDelay(): void {
        this.transitionDelay = false;
    }
}