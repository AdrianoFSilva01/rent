import "@/Assets/base.pcss";
import directives from "@/Extensions/Directives/installDirectives";
import mixins from "@/Extensions/Mixins/installMixins";
import ApartmentsView from "@/Views/ApartmentsView/ApartmentsView.vue";
import MainView from "@/Views/MainView/MainView.vue";
import OurHouseView from "@/Views/OurHouseView/OurHouseView.vue";
import "reflect-metadata";
import { App, createApp } from "vue";
import { createRouter, createWebHistory, Router } from "vue-router";
import MasterPage from "./MasterPage/MasterPage.vue";

const app: App<Element> = createApp(MasterPage);

const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: MainView},
        { path: "/apartments", component: ApartmentsView},
        { path: "/ourhouse", component: OurHouseView}
    ]
});

app.use(mixins);
app.use(directives);
app.use(router);

app.mount("#app");
