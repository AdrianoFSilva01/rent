import Arrow from "@/Components/Arrow/Arrow.vue";
import ArrowDirection from "@/Components/Arrow/ArrowDirection";
import CarouselTs from "@/Components/Carousel/Carousel";
import Carousel from "@/Components/Carousel/Carousel.vue";
import DatePickerTs from "@/Components/DatePicker/DatePicker";
import DatePicker from "@/Components/DatePicker/DatePicker.vue";
import Dropdown from "@/Components/Dropdown/Dropdown.vue";
import DropdownList from "@/Components/DropdownList/DropdownList.vue";
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
        DropdownList
    },
    enums: {
        ArrowDirection
    }
})
export default class Main<T> extends Vue{
    @Ref() carousel!: CarouselTs;
    @Ref() datePicker!: DatePickerTs;
    @Ref() datePickerUntil!: DatePickerTs;

    selectedPersons: T | null = null;
    persons: Array<string> = ["1 Person", "2 Persons", "3 Persons", "4 Persons", "5 Persons"];

    images: Array<string> = ["https://magazine.luxevile.com/wp-content/uploads/2015/03/CasasDeLuxo16.jpg",
        "https://executivedigest.sapo.pt/wp-content/uploads/2019/08/92864803.jpg",
        "https://st3.idealista.pt/news/arquivos/2019-08/casa_frente_mar_2027.jpg?sv=G3jgYicU"];
    selectedDay: DateTime | null = null;
    selectedDayUntil: DateTime | null = null;
    startDate: DateTime = new DateTime();

    get startDateUntil(): DateTime {
        if (this.selectedDay) {
            if (this.selectedDayUntil && this.selectedDay > this.selectedDayUntil) {
                console.log("Null");
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
        this.carousel?.previousImage();
    }

    nextImage(): void {
        this.carousel?.nextImage();
    }
}