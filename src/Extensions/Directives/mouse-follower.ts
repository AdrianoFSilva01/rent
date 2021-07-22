import { DirectiveBinding } from "@vue/runtime-core";

export default {
    mounted: function (el: HTMLElement, biding: DirectiveBinding): void {
        const mouseFollower: HTMLElement | null = document.getElementById(biding.value);
        let mouseX: number = 0;
        let mouseY: number = 0;
        let mouseFollowerX: number = el.offsetLeft;
        let mouseFollowerY: number = el.getBoundingClientRect().top + window.pageYOffset;
        let interval: number = 0;
        let scrollY: number = 0;
        let addScrollValue: number = 0;

        const scroll = (): void => {
            if(!scrollY) {
                scrollY = window.scrollY;
            } else if(scrollY !== window.scrollY) {
                addScrollValue = window.scrollY - scrollY;
            }
        };

        el.addEventListener("mouseenter", (mouseEvent: MouseEvent) => {
            if(mouseFollower) {
                window.addEventListener("scroll", scroll);
                mouseFollowerX = mouseEvent.pageX;
                mouseFollowerY = mouseEvent.pageY;
                mouseX = mouseEvent.pageX;
                mouseY = mouseEvent.pageY;
                interval = setInterval(() => {
                    mouseFollowerX += (mouseX - mouseFollowerX) / 12;
                    mouseFollowerY += ((mouseY + addScrollValue) - mouseFollowerY) / 12;
                    mouseFollower.style.left = `${mouseFollowerX - mouseFollower.offsetWidth / 2}px`;
                    mouseFollower.style.top = `${mouseFollowerY - mouseFollower.offsetHeight / 2}px`;
                    mouseFollower.style.display = "block";

                }, 10);
            }
        });

        el.addEventListener("mousemove", (mouseEvent: MouseEvent) => {
            addScrollValue = 0;
            scrollY = 0;
            mouseX = mouseEvent.pageX;
            mouseY = mouseEvent.pageY;
        });

        el.addEventListener("mouseleave", () => {
            if (mouseFollower) {
                window.removeEventListener("scroll", scroll);
                clearInterval(interval);
                mouseFollower.style.display = "none";
            }
        });
    }
};