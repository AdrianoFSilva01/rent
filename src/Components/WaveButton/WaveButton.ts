import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class WaveButton extends Vue{
    @Prop() buttontext: string | null = null;
}