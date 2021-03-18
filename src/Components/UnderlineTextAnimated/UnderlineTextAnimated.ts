import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class UnderlineTextAnimated extends Vue{
    @Prop() text: string | null = null;
    @Prop({default: null}) color!: string;
}