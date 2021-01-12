import HamburgerMenu from "@/Components/HamburgerMenu/HamburgerMenu.vue";
import UnderlineTextAnimated from "@/Components/UnderlineTextAnimated/UnderlineTextAnimated.vue";
import WaveButton from "@/Components/WaveButton/WaveButton.vue";
import { Options, Vue } from "vue-class-component";

@Options({
    components:{
        HamburgerMenu,
        UnderlineTextAnimated,
        WaveButton
    }
})
export default class HeaderView extends Vue {

}