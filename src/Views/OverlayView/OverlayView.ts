import { Vue } from "vue-class-component";

export default class OverlayView extends Vue {
    show: boolean = false;
    transitionEnded: boolean = false;
    transitionDelay: boolean = true;

    toogleDisplay(): void {
        this.show = !this.show;

        if(this.show) {
            this.transitionDelay = true;
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }

    changeDelay(): void {
        this.transitionDelay = false;
    }
}