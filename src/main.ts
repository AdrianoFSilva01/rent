import "@/Assets/base.pcss";
import { DirectiveBinding } from "@vue/runtime-core";
import "reflect-metadata";
import { App, ComponentPublicInstance, createApp } from "vue";
import clickOutside, { scrollOutside } from "./click-outside";
import MasterPage from "./MasterPage/MasterPage.vue";

const app: App<Element> = createApp(MasterPage);

app.config.warnHandler = (msg: string, instance: ComponentPublicInstance | null, trace: string): void => {
    if (instance) {
        console.error(`[Vue warn]: ${msg}\n${trace}\n\nProps:\n--->\t${JSON.stringify(instance.$props)}`);
    } else {
        console.error(`[Vue warn]: ${msg}\n${trace}`);
    }
};

// Separar diretivas para um ficheiro aparte

app.directive("focus", {
    mounted: function (el: HTMLElement, binding: DirectiveBinding): void {
        if (binding.value === undefined || binding.value === true) {
            el.focus();
        } else {
            el.blur();
        }
    }
});

app.directive("first-hover", {
    beforeMount: function (el: HTMLElement, binding: DirectiveBinding): void {
        const firstHoverHandler = (): void => {
            el.classList.add(binding.value);
            el.removeEventListener("mouseover", firstHoverHandler);
        }

        el.addEventListener("mouseover", firstHoverHandler);
    }
});

app.mixin({
    created(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enums: any = this.$options.enums;
        if(enums) {
            for (const name of Object.keys(enums)) {
                this[name] = Object.freeze(enums[name]);
                console.log(enums[name]);
            }
        }
    }
})

app.directive("click-outside", clickOutside);
app.directive("scroll-outside", scrollOutside);

app.mount("#app");
