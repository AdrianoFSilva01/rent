import { DirectiveBinding } from "@vue/runtime-core";

export default {
    mounted: function (el: HTMLElement, biding: DirectiveBinding): void {
        let coordinateY: number = 0;

        window.addEventListener("scroll", () => {
            if (!coordinateY) {
                coordinateY = el.getBoundingClientRect().top;
                if(window.pageYOffset) {
                    coordinateY += window.pageYOffset;
                }
            }

            if(coordinateY <= window.innerHeight + window.pageYOffset) {
                el.classList.add(biding.value);
            }
        })

        // Conta para qnd der scroll a não ver mais o elemento:
        // el.offsetTop + el.offsetHeight + window.innerHeight >= window.innerHeight + window.pageYOffset
    }
}