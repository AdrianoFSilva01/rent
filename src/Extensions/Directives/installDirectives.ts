import { App } from "vue";
import clickOutside from "./click-outside";
import firstHover from "./first-hover";
import focus from "./focus";
import scrollOutside from "./scroll-outside";

export default function installDirectives(app: App<Element>): void {
    app.directive("focus", focus);
    app.directive("first-hover", firstHover);
    app.directive("click-outside", clickOutside);
    app.directive("scroll-outside", scrollOutside);
}