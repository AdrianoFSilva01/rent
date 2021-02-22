import Arrow from "@/Components/Arrow/Arrow.vue";
import ArrowDirection from "@/Components/Arrow/ArrowDirection";
import CarouselTs from "@/Components/Carousel/Carousel";
import Carousel from "@/Components/Carousel/Carousel.vue";
import DatePickerTs from "@/Components/DatePicker/DatePicker";
import DatePicker from "@/Components/DatePicker/DatePicker.vue";
import Dropdown from "@/Components/Dropdown/Dropdown.vue";
import DropdownList from "@/Components/DropdownList/DropdownList.vue";
import SliderTs from "@/Components/Slider/Slider";
import Slider from "@/Components/Slider/Slider.vue";
import TextCarousel from "@/Components/TextCarousel/TextCarousel.vue";
import WaveButton from "@/Components/WaveButton/WaveButton.vue";
import DateTime from "@/Extensions/Types/DateTime/DateTime";
import { Options, Vue } from "vue-class-component";
import { Ref } from "vue-property-decorator";

@Options({
    components: {
        Arrow,
        Carousel,
        WaveButton,
        DatePicker,
        Dropdown,
        DropdownList,
        TextCarousel,
        Slider
    },
    enums: {
        ArrowDirection
    }
})
export default class Main<T> extends Vue{
    @Ref() slider!: SliderTs;
    @Ref() datePicker!: DatePickerTs;
    @Ref() datePickerUntil!: DatePickerTs;
    @Ref() carousel!: CarouselTs;
    @Ref() carouselItem!: HTMLElement;

    selectedPersons: T | null = null;
    persons: Array<string> = ["1 Person", "2 Persons", "3 Persons", "4 Persons", "5 Persons"];

    private _carouselItems: Rooms = new Rooms();
    disableNextCarouselButton: boolean = false;
    disablePreviousCarouselButton: boolean = false;

    images: Array<string> = ["https://magazine.luxevile.com/wp-content/uploads/2015/03/CasasDeLuxo16.jpg",
        "https://executivedigest.sapo.pt/wp-content/uploads/2019/08/92864803.jpg",
        "https://st3.idealista.pt/news/arquivos/2019-08/casa_frente_mar_2027.jpg?sv=G3jgYicU"];
    selectedDay: DateTime | null = null;
    selectedDayUntil: DateTime | null = null;
    startDate: DateTime = new DateTime();

    get carouselItems(): Rooms {
        return new Proxy(this._carouselItems, {
            get: (target: Rooms, property: string): unknown => {
                const keys: Array<string> = Object.keys(this._carouselItems)
                const index: number = keys.indexOf(property);
                if(index >= 0) {
                    let position: number = 0;
                    for(let i: number = 0; i < index && index > 0; i++) {
                        position+= this._carouselItems[keys[i]].length;
                    }
                    return new Proxy(target[property], {
                        get: (innerTarget: Array<Array<string>>, innerProperty: string): unknown => {
                            if (!isNaN(Number(innerProperty))) {
                                position++;
                            }
                            if(innerProperty === nameof(position)) {
                                return position;
                            }
                            return Reflect.get(innerTarget, innerProperty);
                        }
                    });
                }
                return Reflect.get(target, property);
            }
        })
    };

    get startDateUntil(): DateTime {
        if (this.selectedDay) {
            if (this.selectedDayUntil && this.selectedDay > this.selectedDayUntil) {
                this.selectedDayUntil = null;
            }
            return new DateTime(this.selectedDay).nextDay()
        } else {
            return new DateTime().nextDay();
        }
    }

    reset(): void {
        this.datePicker.reset();
    }

    resetUntil(): void {
        this.datePickerUntil?.reset();
    }

    prevImage(): void {
        this.slider.previousImage();
    }

    nextImage(): void {
        this.slider.nextImage();
    }

    nextCarouselItem(): void {
        this.carousel.nextItem();
    }

    previousCarouselItem(): void {
        this.carousel.previousItem();
    }

    onSelectedTextCarousel(selectedTextCarousel: string): void {
        const element: HTMLElement = document.getElementById(selectedTextCarousel) as HTMLElement;
        this.carousel.nextSection(element);
    }
}

class Rooms implements Record<string, Array<Array<string>>>{
    [x: string]: string[][];
    Apartment: Array<Array<string>> = [["https://hipercentrodomovel.pt/wp-content/uploads/2019/06/QUCfoloBCFC003creta.jpg", "Deluxe Appartement", "max. 6 Persons, approx. 70m²", "from 249€"],
        ["https://cf.bstatic.com/images/hotel/max1024x768/144/144383113.jpg", "Comfort Appartement", "max. 6 Persons, approx. 60m²", "from 229€"],
        ["https://cf.bstatic.com/images/hotel/max1024x768/186/186088460.jpg", "Garden Appartement", "max. 6 Persons, approx. 100m²", "from 279€"]]
    Studio: Array<Array<string>> = [
        ["https://robbreport.com/wp-content/uploads/2019/02/hotel-ottilia-suite_bedroom.jpg?w=1000", "Comfort Studio", "4 Persons, approx. 40m²", "from 139€"],
        ["https://i.pinimg.com/originals/fe/19/aa/fe19aa5489cfb0a8ce4d5c6d2666c946.jpg", "Penthouse Studio", "max. 4 Persons, approx. 40m²", "from 179€"],
        ["https://cf.bstatic.com/images/hotel/max1024x768/153/153840518.jpg", "Garden Studio", "max. 4 Persons, approx. 60m²", "from 179€"]]
}