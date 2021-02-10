import { Vue } from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";
import ArrowDirection from "./ArrowDirection";

export default class Arrow extends Vue{
    @Ref() arrow: HTMLElement | undefined;
    @Prop({default: undefined}) direction: ArrowDirection | undefined;
    @Prop() disableButton: boolean = false;

    mounted(): void {
        if(this.direction) {
            this.arrow?.classList.add("transform", this.direction);
        }
    }
}