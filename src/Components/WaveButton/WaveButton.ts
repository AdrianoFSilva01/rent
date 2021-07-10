import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class WaveButton extends Vue{
    @Prop({required: true}) buttontext!: string;
    @Prop({default: "black"}) backgroundColor!: string;
    @Prop({default: "black"}) textColor!: string;
    @Prop({default: "white"}) textHoverColor!: string;

    mounted(): void {
        (this.$el as HTMLElement).style.setProperty("--background", this.backgroundColor);
        (this.$el as HTMLElement).style.setProperty("--span-text", this.textColor);
        (this.$el as HTMLElement).style.setProperty("--span-hover-text", this.textHoverColor);
    }
}