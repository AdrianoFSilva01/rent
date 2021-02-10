import { DirectiveBinding } from "@vue/runtime-core";

export default {
    mounted: function (el: HTMLElement, biding: DirectiveBinding): void {
        const mouseFollower: HTMLElement | null = document.getElementById(biding.value);

        el.addEventListener("mousemove", (mouseEvent: MouseEvent) => {
            if (mouseFollower) {
                mouseFollower.style.left = `${mouseEvent.pageX - mouseFollower.offsetWidth / 2}px`;
                mouseFollower.style.top = `${mouseEvent.pageY - mouseFollower.offsetHeight / 2}px`;
                mouseFollower.style.display = "block";
            }
        });

        el.addEventListener("mouseleave", () => {
            if (mouseFollower) {
                mouseFollower.style.display = "none";
            }
        });
    }
};