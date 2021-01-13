import { App } from "vue";
import enumsMixin from "./enums";

export default function installMixins(app: App<Element>): void {
    app.mixin(enumsMixin);
}