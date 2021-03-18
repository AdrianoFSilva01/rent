import Input from "@/Components/UnderlineInputAnimated/UnderlineInputAnimated.vue";
import UnderlineText from "@/Components/UnderlineTextAnimated/UnderlineTextAnimated.vue";
import WaveButton from "@/Components/WaveButton/WaveButton.vue";
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue-property-decorator";

@Options({
    components: {
        Input,
        WaveButton,
        UnderlineText
    }
})
export default class FooterView extends Vue {
    @Ref() checkbox!: HTMLElement;
    toogle: boolean = false;

    toggleCheckbox(): void {
        this.toogle = !this.toogle;
        if(this.toogle) {
            this.checked();
        } else {
            this.notChecked();
        }
    }

    checked(): void {
        this.checkbox.classList.remove("w-0");
        this.checkbox.classList.remove("h-0");
        this.checkbox.classList.add("w-full");
        this.checkbox.classList.add("h-full");
    }

    notChecked(): void {
        this.checkbox.classList.remove("w-full");
        this.checkbox.classList.remove("h-full");
        this.checkbox.classList.add("w-0");
        this.checkbox.classList.add("h-0");
    }

    backToTop(): void {
        document.documentElement.scrollTop = 0;
    }
}