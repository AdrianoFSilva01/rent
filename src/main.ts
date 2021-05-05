import "@/Assets/base.pcss";
import directives from "@/Extensions/Directives/installDirectives";
import mixins from "@/Extensions/Mixins/installMixins";
import ApartmentsView from "@/Views/ApartmentsView/ApartmentsView.vue";
import MainView from "@/Views/MainView/MainView.vue";
import "reflect-metadata";
import { App, ComponentPublicInstance, createApp } from "vue";
import { createRouter, createWebHistory, Router } from "vue-router";
import MasterPage from "./MasterPage/MasterPage.vue";

const app: App<Element> = createApp(MasterPage);

const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: MainView},
        { path: "/apartments", component: ApartmentsView}
    ]
}
);

app.config.warnHandler = (msg: string, instance: ComponentPublicInstance | null, trace: string): void => {
    if (msg.includes('should not start with "$" or "_"')) {
        return;
    }
    if (instance) {
        console.error(`[Vue warn]: ${msg}\n${trace}\n\nProps:\n--->\t${JSON.stringify(instance.$props)}`);
    } else {
        console.error(`[Vue warn]: ${msg}\n${trace}`);
    }
};

app.use(mixins);
app.use(directives);
app.use(router);

app.mount("#app");
