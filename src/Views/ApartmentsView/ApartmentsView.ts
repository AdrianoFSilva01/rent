import WaveButton from "@/Components/WaveButton/WaveButton.vue";
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue-property-decorator";

@Options({
    components: {
        WaveButton
    }
})
export default class ApartmentsView extends Vue {
    @Ref() roomsList: HTMLElement | undefined;
    @Ref() roomDisplay: HTMLElement | undefined;

    houses: Array<Array<string>> = [
        ["https://hipercentrodomovel.pt/wp-content/uploads/2019/06/QUCfoloBCFC003creta.jpg", "Deluxe Appartement", "max. 6 Persons", "approx. 70m²", "from 249€",
            "Enough space to sleep, play, rest, sweat and cuddle: our deluxe apartments with two bedrooms, living kitchen and Swiss pine sauna on the loggia."],
        ["https://cf.bstatic.com/images/hotel/max1024x768/144/144383113.jpg", "Comfort Appartement", "max. 6 Persons", "approx. 60m²", "from 229€",
            "When one combines two bedrooms, a living room/kitchen and a loggia with sauna, all wishes are granted."],
        ["https://cf.bstatic.com/images/hotel/max1024x768/186/186088460.jpg", "Garden Appartement", "max. 6 Persons",  "approx. 100m²", "from 279€",
            "Can’t decide if you’d rather sit in the garden, on the loggia or in the sauna? Then just book our garden apartment. That way you can do all three."],
        ["https://robbreport.com/wp-content/uploads/2019/02/hotel-ottilia-suite_bedroom.jpg?w=1000", "Comfort Studio", "4 Persons", "approx. 40m²", "from 139€",
            "A dream of a room: the comfort studio leaves a lasting impression in all our guests. And that’s not just because of the cosy sauna."],
        ["https://i.pinimg.com/originals/fe/19/aa/fe19aa5489cfb0a8ce4d5c6d2666c946.jpg", "Penthouse Studio", "max. 4 Persons", "approx. 40m²", "from 179€",
            "For all those who want to go places – and want to stay there: our penthouse studio with loggia and Swiss pine sauna over the village roofs."],
        ["https://cf.bstatic.com/images/hotel/max1024x768/153/153840518.jpg", "Garden Studio", "max. 4 Persons", "approx. 60m²", "from 179€",
            "For those who’d rather stay grounded: our exclusive garden studio on the ground floor. Private garden included."]];
    selectedIndex: number = 0;
    scrollPosition: number = 0;
    spaceBetweenRooms: number = 0;

    mounted(): void {
        if(this.roomsList && this.roomDisplay) {
            this.spaceBetweenRooms = (this.roomsList.offsetHeight - (this.houses.length * this.roomDisplay.offsetHeight)) / (this.houses.length - 1);
        }

        document.addEventListener("scroll", () => {
            if(this.roomsList && this.roomDisplay)
            {
                if(pageYOffset >= this.roomsList.offsetTop && pageYOffset <= this.roomsList.offsetTop + this.roomsList.offsetHeight) {
                    this.scrollPosition = pageYOffset - this.roomsList.offsetTop;
                    if(this.scrollPosition < this.roomDisplay.offsetHeight) {
                        this.selectedIndex = 0;
                    } else {
                        const scrollPositionWithoutFirstElement: number = (this.scrollPosition - this.roomDisplay.offsetHeight);
                        this.selectedIndex = Math.floor(scrollPositionWithoutFirstElement / (this.roomDisplay.offsetHeight + this.spaceBetweenRooms)) + 1;
                    }
                }
            }
        });
    }
}