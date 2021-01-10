import { DirectiveBinding } from "@vue/runtime-core";

interface ClickOutsideElement extends HTMLElement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __vueClickEventHandler__: any;
}

export default {
    beforeMount: function (el: ClickOutsideElement, binding: DirectiveBinding): void {
        const ourClickEventHandler = (event: Event): void => {
            if (!el.contains(event.target as HTMLElement) && el !== event.target) {
                binding.value(event);
            }
        };

        const ourClickEventHandler2 = (event: Event): void => {
            binding.value(event);
        };

        el.__vueClickEventHandler__ = ourClickEventHandler;

        document.addEventListener("click", ourClickEventHandler, true);
        document.addEventListener("contextmenu", ourClickEventHandler, true);
        window.addEventListener("resize", ourClickEventHandler2, true);
    },
    unmounted: function (el: ClickOutsideElement): void {
        document.removeEventListener("click", el.__vueClickEventHandler__);
        document.removeEventListener("contextmenu", el.__vueClickEventHandler__);
        window.removeEventListener("resize", el.__vueClickEventHandler__);
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const scrollOutside: any = {
    beforeMount: function (el: ClickOutsideElement, binding: DirectiveBinding): void {
        const ourClickEventHandler = (event: Event): void => {
            if (!el.contains(event.target as HTMLElement) && el !== event.target) {
                binding.value(event);
            }
        };

        el.__vueClickEventHandler__ = ourClickEventHandler;

        document.addEventListener("scroll", ourClickEventHandler, true);
    },
    unmounted: function (el: ClickOutsideElement): void {
        document.removeEventListener("scroll", el.__vueClickEventHandler__);
    }
};
