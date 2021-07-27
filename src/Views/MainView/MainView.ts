import Arrow from "@/Components/Arrow/Arrow.vue";
import ArrowDirection from "@/Components/Arrow/ArrowDirection";
import CarouselTs from "@/Components/Carousel/Carousel";
import Carousel from "@/Components/Carousel/Carousel.vue";
import SelectedPositionCarousel from "@/Components/Carousel/SelectedPosition";
import DatePickerTs from "@/Components/DatePicker/DatePicker";
import DatePicker from "@/Components/DatePicker/DatePicker.vue";
import Dropdown from "@/Components/Dropdown/Dropdown.vue";
import DropdownList from "@/Components/DropdownList/DropdownList.vue";
import SliderTs from "@/Components/Slider/Slider";
import Slider from "@/Components/Slider/Slider.vue";
import TextCarouselTs from "@/Components/TextCarousel/TextCarousel";
import TextCarousel from "@/Components/TextCarousel/TextCarousel.vue";
import WaveButton from "@/Components/WaveButton/WaveButton.vue";
import DateTime from "@/Extensions/Types/DateTime/DateTime";
import { Options, Vue } from "vue-class-component";
import { Ref, Watch } from "vue-property-decorator";

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
        ArrowDirection,
        SelectedPositionCarousel
    }
})
export default class Main<T> extends Vue{
    @Ref() slider!: SliderTs;
    @Ref() datePicker!: DatePickerTs;
    @Ref() datePickerUntil!: DatePickerTs;
    @Ref() textCarousel!: TextCarouselTs;
    @Ref() carousel!: CarouselTs;
    @Ref() carouselItem!: HTMLElement;
    @Ref() activityCarousel!: CarouselTs;
    @Ref() activitySlider!: SliderTs;
    @Ref() activityCarouselItem!: HTMLElement;
    @Ref() intervalBar!: HTMLElement;
    @Ref() activitySliderContainer!: HTMLElement;

    selectedPersons: T | null = null;
    persons: Array<string> = ["1 Person", "2 Persons", "3 Persons", "4 Persons", "5 Persons"];

    private _carouselItems: Rooms = new Rooms();
    disableNextSliderButton: boolean = false;
    disablePreviousSliderButton: boolean = false;
    disableNextCarouselButton: boolean = false;
    disablePreviousCarouselButton: boolean = false;
    disableNextActivityCarouselButton: boolean = false;
    disablePreviousActivityCarouselButton: boolean = false;

    images: Array<string> = ["https://magazine.luxevile.com/wp-content/uploads/2015/03/CasasDeLuxo16.jpg",
        "https://executivedigest.sapo.pt/wp-content/uploads/2019/08/92864803.jpg",
        "https://st3.idealista.pt/news/arquivos/2019-08/casa_frente_mar_2027.jpg?sv=G3jgYicU"];
    selectedDay: DateTime | null = null;
    selectedDayUntil: DateTime | null = null;
    startDate: DateTime = new DateTime();

    carouselIndex: number = 0;
    carouselKeys: Array<string> = Object.keys(this._carouselItems);
    carouselKeysIndex: number = 0;
    carouselItemsLenght: number = this._carouselItems[this.carouselKeys[this.carouselKeysIndex]].length;

    activities: Array<Array<string>> = [["Hiking", "https://wallpaperaccess.com/full/428865.jpg"],
        ["Mountain Biking", "https://www.wallpapers13.com/wp-content/uploads/2020/02/With-Bicycle-all-over-the-world-Mountain-bike-trails-4K-ultra-HD-Wallpaper-1920x1080.jpg"],
        ["Climbing", "https://www.pixel4k.com/wp-content/uploads/2018/10/girl-mountain-climber-5k_1538786999.jpg"],
        ["Golf", "https://i.pinimg.com/originals/c6/ca/1f/c6ca1f1c86f0c6c037a38df6b3754be2.jpg"],
        ["Jeep Tours", "https://adrenalineportugal.com/wp-content/uploads/2020/02/Our-fun-filled-Arrabida-Jeep-Tour.jpg"],
        ["Sup Tours", "https://www.seabookings.com/photos/original/5969-sup-tours-in-benagil-1594651553-jpg"],
        ["Surf", "https://wallpaperaccess.com/full/1303332.jpg"]];
    activitiesImages: Array<string>  = ["https://wallpaperaccess.com/full/428865.jpg",
        "https://www.wallpapers13.com/wp-content/uploads/2020/02/With-Bicycle-all-over-the-world-Mountain-bike-trails-4K-ultra-HD-Wallpaper-1920x1080.jpg",
        "https://www.pixel4k.com/wp-content/uploads/2018/10/girl-mountain-climber-5k_1538786999.jpg",
        "https://i.pinimg.com/originals/c6/ca/1f/c6ca1f1c86f0c6c037a38df6b3754be2.jpg",
        "https://adrenalineportugal.com/wp-content/uploads/2020/02/Our-fun-filled-Arrabida-Jeep-Tour.jpg",
        "https://www.seabookings.com/photos/original/5969-sup-tours-in-benagil-1594651553-jpg",
        "https://wallpaperaccess.com/full/1303332.jpg"];
    activitiesCarouselIndex: number = 0;
    activityCarouselBeingDragged: boolean = false;
    unableToChangeSliderOpacity: boolean = false;

    get carouselItems(): Rooms {
        return new Proxy(this._carouselItems, {
            get: (target: Rooms, property: string): unknown => {
                const index: number = this.carouselKeys.indexOf(property);
                if(index >= 0) {
                    let position: number = 0;
                    for(let i: number = 0; i < index && index > 0; i++) {
                        position+= this._carouselItems[this.carouselKeys[i]].length;
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

    @Watch(nameof((main: Main<T>) => main.carouselIndex))
    onCarouselIndexChange(): void {
        if(this.carouselIndex === this.carouselItemsLenght){
            if(this.carouselKeysIndex < this.carouselKeys.length - 1) {
                this.carouselKeysIndex++;
                this.carouselItemsLenght += this._carouselItems[this.carouselKeys[this.carouselKeysIndex]].length;
            }
            this.textCarousel.textSelect(null, this.carouselKeysIndex);
        } else if(this.carouselKeysIndex > 0 && this.carouselIndex === this.carouselItemsLenght - this._carouselItems[this.carouselKeys[this.carouselKeysIndex]].length - 1) {
            this.carouselItemsLenght -= this._carouselItems[this.carouselKeys[this.carouselKeysIndex]].length;
            this.carouselKeysIndex--;
            this.textCarousel.textSelect(null, this.carouselKeysIndex);
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
        this.slider.nextImage(false);
    }

    nextCarouselItem(): void {
        this.carousel.nextItem();
    }

    previousCarouselItem(): void {
        this.carousel.previousItem();
    }

    changedActivitySliderImage(index: number): void {
        this.activityCarousel.AlignByIndex(index);
        this.disableNextActivityCarouselButton = true;
        this.disablePreviousActivityCarouselButton = true;
    }

    onSelectedTextCarousel(selectedTextCarousel: string): void {
        const element: HTMLElement = document.getElementById(selectedTextCarousel) as HTMLElement;
        this.carousel.goToElement(element);
    }

    nextActivityCarouselItem(clicked: boolean): void {
        this.activitySlider.nextImage(clicked);
        this.activityCarousel.nextItem();
    }

    previousActivityCarouselItem(): void {
        this.activitySlider.previousImage();
        this.activityCarousel.previousItem();
    }

    stopSliderInterval(): void {
        this.activitySlider.stopInterval();
    }

    addSliderInterval(): void {
        this.activitySlider.occuringInterval = false;
        this.activitySlider.addInterval();
    }

    selectedChanged(selected: number): void {
        this.activitySlider.goToIndex(selected);
    }

    activitySliderMouseDown(): void {
        this.activityCarousel.transitionEnded = false;
    }

    activitySliderMouseMoving(sliderClientX: number, changeOpacityMargin: number): void {
        this.activityCarousel.selectedChanged(
            (sliderClientX * this.activityCarousel.childElementWidth) / this.activitySliderContainer.clientWidth,
            (changeOpacityMargin * this.activityCarousel.childElementWidth) / this.activitySliderContainer.clientWidth
        );
    }

    activitySliderMouseUp(): void {
        this.activityCarousel.addInterval = true;
        this.activityCarousel.AlignByIndex(this.activityCarousel.selectedItemIndex);
    }

    activityCarouselMouseMoving(carouselClientX: number, selectedItemIndex: number): void {
        this.activitySlider.selectedChanging(carouselClientX / this.activityCarousel.childElementWidth, selectedItemIndex);
    }

    activityCarouselMouseUp(index: number): void {
        this.activitySlider.selectedChanged(index);
    }

    activitySliderMoving(sliderWidth: number, mouseX: number): void {
        this.activityCarousel.move((mouseX * this.activityCarouselItem.offsetWidth) / sliderWidth);
    }

    activityCarouselAlignItems(index: number): void {
        this.activityCarousel.alignItems(index);
    }

    disableSliderArrow(): void {
        this.disableNextSliderButton = true;
        this.disablePreviousSliderButton = true;
    }

    enableSliderArrow(): void {
        this.disableNextSliderButton = false;
        this.disablePreviousSliderButton = false;
    }

    disableArrow(): void {
        this.disableNextCarouselButton = true;
        this.disablePreviousCarouselButton = true;
    }

    enableArrow(disableNextButton: boolean, disablePreviousButton: boolean): void {
        this.disableNextCarouselButton = disableNextButton;
        this.disablePreviousCarouselButton = disablePreviousButton;
    }

    disableActivityArrow(): void {
        this.disableNextActivityCarouselButton = true;
        this.disablePreviousActivityCarouselButton = true;
        (this.activitySlider.$el as HTMLElement).style.cursor = "not-allowed";
        ((this.activitySlider.$el as HTMLElement).firstElementChild as HTMLElement).style.pointerEvents = "none";
    }

    enableActivityArrow(): void {
        this.disableNextActivityCarouselButton = false;
        this.disablePreviousActivityCarouselButton = false;
        (this.activitySlider.$el as HTMLElement).style.cursor = "grab";
        ((this.activitySlider.$el as HTMLElement).firstElementChild as HTMLElement).style.pointerEvents = "auto";
    }

    startIntervalBarTransition(transitionDuration: number): void {
        this.intervalBar.style.transitionDuration = transitionDuration + "ms";
        this.intervalBar.classList.remove("loaded");
        this.intervalBar.classList.remove("stop");
        this.intervalBar.classList.add("loading");
    }

    intervalBarLoadedTransition(transitionDuration: number): void {
        this.intervalBar.style.transitionDuration = transitionDuration + "s";
        this.intervalBar.classList.remove("loading");
        this.intervalBar.classList.remove("stop");
        this.intervalBar.classList.add("loaded");
    }

    intervalBarStopTransition(transitionDuration: number): void {
        this.intervalBar.style.transitionDuration = transitionDuration + "s";
        this.intervalBar.classList.remove("loading");
        this.intervalBar.classList.remove("loaded");
        this.intervalBar.classList.add("stop");
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
    Room: Array<Array<string>> = [
        ["https://imgcy.trivago.com/c_limit,d_dummy.jpeg,f_auto,h_1300,q_auto,w_2000/itemimages/35/04/3504320_v1.jpeg", "Deluxe Room", "2 Persons, approx. 30m²", "from 109€"],
        ["https://petervonstamm-travelblog.com/wp-content/uploads/2017/11/Mood-Rooms-NH-Collection-Eurobuilding-Madrid-TITEL.jpg", "Comfort Room", "max. 3 Persons, approx. 40m²", "from 149€"],
        ["https://hauteliving.com/wp-content/uploads/2017/12/four-seasons-wellness-room_35629330350_o_35236594663_o-1.jpg", "Penthouse Room", "max. 4 Persons, approx. 60m²", "from 179€"],
        ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/ee/d8/a4/sea-view-room-galomar.jpg?w=900&h=-1&s=1", "Garden Room", "max. 4 Persons, approx. 70m²", "from 189€"]]
}