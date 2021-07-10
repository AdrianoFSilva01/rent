import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class UnderlineTextAnimated extends Vue{
    @Prop({required: true}) text!: string;
    @Prop({default: null}) color!: string | null;
}