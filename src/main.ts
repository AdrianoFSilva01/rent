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

app.directive("focus", {
    mounted: function (el: HTMLElement, binding: DirectiveBinding): void {
        if (binding.value === undefined || binding.value === true) {
            el.focus();
        } else {
            el.blur();
        }
    }
});

app.directive("click-outside", clickOutside);
app.directive("scroll-outside", scrollOutside);

app.mount("#app");
