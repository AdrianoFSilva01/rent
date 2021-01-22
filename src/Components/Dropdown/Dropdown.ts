import { Options, Vue } from "vue-class-component";
import { Prop, Ref, Watch } from "vue-property-decorator";

@Options({
    emits: ["open-component", "close-component"]
})
export default class Dropdown extends Vue {
    @Prop() selected: unknown | null = null;
    @Prop() dropdownText: string | null = null;
    @Ref() component!: HTMLElement | null;

    @Watch(nameof((x: Dropdown) => x.selected))
    onSelectedChange(): void {
        this.closeComponent();
    }

    toggleComponent(mouseEvent: MouseEvent): void {
        if (this.component?.classList.contains("show")) {
            this.closeComponent();
        } else {
            this.setupPosition(mouseEvent.clientY, 9, 8);
            this.openComponent();
        }
    }

    closeComponent(): void {
        this.component?.classList.remove("show");
        this.$emit("close-component");
    }

    setupPosition(clientY: number, distanceBottom: number, distanceTop: number): void {
        if (this.component) {
            if (clientY + this.component.offsetHeight + distanceTop > window.innerHeight) {
                this.component.classList.remove("top-" + distanceTop);
                this.component.classList.add("bottom-" + distanceBottom);
            } else {
                this.component?.classList.add("top-" + distanceTop);
                this.component?.classList.remove("bottom-" + distanceBottom);
            }
        }
    }

    openComponent(): void {
        this.component?.classList.add("show");
        this.$emit("open-component");
    }
}