import { Options, Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

@Options({
    emits: ["open-component", "close-component"]
})
export default class Dropdown extends Vue {
    @Prop() selected: unknown | null = null;
    @Prop() dropdownText: string | null = null;
    showComponent: boolean = false;

    @Watch(nameof((x: Dropdown) => x.selected))
    onSelectedChange(): void {
        this.closeComponent();
    }

    toggleComponent(): void {
        if (this.showComponent) {
            this.closeComponent();
        } else {
            this.openComponent();
        }
    }

    openComponent(): void {
        this.showComponent = true;
        this.$emit("open-component");
    }

    closeComponent(): void {
        this.showComponent = false;
        this.$emit("close-component");
    }
}