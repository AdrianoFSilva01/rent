import { DirectiveBinding } from "@vue/runtime-core";

export default {
    mounted: function (el: HTMLElement, binding: DirectiveBinding): void {
        if (binding.value === undefined || binding.value === true) {
            el.focus();
        } else {
            el.blur();
        }
    }
};