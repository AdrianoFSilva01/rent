import { DirectiveBinding } from "@vue/runtime-core";

export default {
    beforeMount: function (el: HTMLElement, binding: DirectiveBinding): void {
        const firstHoverHandler = (): void => {
            el.classList.add(binding.value);
            el.removeEventListener("mouseover", firstHoverHandler);
        }

        el.addEventListener("mouseover", firstHoverHandler);
    }
};