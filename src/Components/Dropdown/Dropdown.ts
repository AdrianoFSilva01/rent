import DropdownList from "@/Components/DropdownList/DropdownList.vue";
import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop, Ref, Watch } from "vue-property-decorator";

@Options({
    inheritAttrs: false,
    components: {
        DropdownList
    },
    emits: ["open-component", "close-component", "update:modelValue"]
})
export default class Dropdown<T> extends Vue {
    @ModelSync("modelValue", "update:modelValue", { default: null} ) selected!: T | null;
    @Prop({default: null}) dropdownText!: string | null;
    @Prop({ default: null}) source!: Array<T> | null;
    @Ref() component!: HTMLElement | null;

    @Prop() styleClass!: string;

    bottomDistance: number = 0;

    @Watch(nameof((x: Dropdown<T>) => x.selected))
    onSelectedChange(): void {
        this.closeComponent();
    }

    mounted(): void {
        if(this.component?.parentElement) {
            this.bottomDistance = this.convertPixelsToRem(this.component?.parentElement?.offsetHeight);
        }
    }

    convertPixelsToRem(pixels: number): number {
        return pixels / parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    toggleComponent(): void {
        if (this.component?.classList.contains("show")) {
            this.closeComponent();
        } else {
            this.setupPosition(9, 8);
            this.openComponent();
        }
    }

    closeComponent(): void {
        this.component?.classList.remove("show");
        this.$emit("close-component");
    }

    setupPosition(distanceBottom: number, distanceTop: number): void {
        if (this.component) {
            if (this.$el.getBoundingClientRect().top + this.component.offsetHeight + distanceBottom + this.$el.offsetHeight > window.innerHeight) {
                this.component.classList.remove("top-8");
                this.component.classList.add("bottom-9");
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