import { DirectiveBinding } from "@vue/runtime-core";

interface ScrollOutsideElement extends HTMLElement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __vueClickEventHandler__: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default {
    beforeMount: function (el: ScrollOutsideElement, binding: DirectiveBinding): void {
        const ourClickEventHandler = (event: Event): void => {
            if (!el.contains(event.target as HTMLElement) && el !== event.target) {
                binding.value(event);
            }
        };

        el.__vueClickEventHandler__ = ourClickEventHandler;

        document.addEventListener("scroll", ourClickEventHandler, true);
    },
    unmounted: function (el: ScrollOutsideElement): void {
        document.removeEventListener("scroll", el.__vueClickEventHandler__);
    }
};