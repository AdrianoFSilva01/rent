import { DirectiveBinding } from "@vue/runtime-core";

export default {
    mounted: function (el: HTMLElement, biding: DirectiveBinding): void {
        const mouseFollower: HTMLElement | null = document.getElementById(biding.value);
        let mouseX: number = 0;
        let mouseY: number = 0;
        let mouseFollowerX: number = el.offsetLeft;
        let mouseFollowerY: number = el.getBoundingClientRect().top + window.pageYOffset;
        let interval: number = 0;

        el.addEventListener("mouseenter", (mouseEvent: MouseEvent) => {
            if(mouseFollower) {
                mouseFollowerX = mouseEvent.pageX;
                mouseFollowerY = mouseEvent.pageY;
                interval = setInterval(() => {
                    mouseFollowerX += (mouseX - mouseFollowerX) / 12;
                    mouseFollowerY += (mouseY - mouseFollowerY) / 12;
                    mouseFollower.style.left = `${mouseFollowerX - mouseFollower.offsetWidth / 2}px`;
                    mouseFollower.style.top = `${mouseFollowerY - mouseFollower.offsetHeight / 2}px`;
                    mouseFollower.style.display = "block";
                }, 10);
            }
        });

        el.addEventListener("mousemove", (mouseEvent: MouseEvent) => {
            mouseX = mouseEvent.pageX;
            mouseY = mouseEvent.pageY;
        });

        el.addEventListener("mouseleave", () => {
            if (mouseFollower) {
                clearInterval(interval);
                mouseFollower.style.display = "none";
            }
        });
    }
};