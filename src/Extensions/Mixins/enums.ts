import { ComponentOptionsMixin } from "vue";

const enumsMixin: ComponentOptionsMixin = {
    created() {
        const enums: Record<string, unknown> = this.$options.enums;
        if(enums) {
            for (const name of Object.keys(enums)) {
                this[name] = Object.freeze(enums[name]);
            }
        }
    }
}

export default enumsMixin;