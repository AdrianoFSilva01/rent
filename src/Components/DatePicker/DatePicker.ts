import DateTime from "@/Extensions/Types/DateTime/DateTime";
import WeekDays from "@/Extensions/Types/DateTime/WeekDays";
import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop, Watch } from "vue-property-decorator";

@Options({
    emits: ["update:modelValue", "selected-day"],
    enums: {
        WeekDays
    }
})
export default class DatePicker extends Vue{
    @ModelSync("modelValue", "update:modelValue") selectedDay!: DateTime;
    @Prop() startDate: DateTime | null = null;

    currentDate: DateTime = new DateTime();

    created(): void {
        this.currentDate = this.startDate ? DateTime.fromDate(this.startDate) : this.currentDate;
    }

    onSelectedDay(selectedDay: DateTime): void {
        this.currentDate = DateTime.fromDate(selectedDay);
        this.selectedDay = DateTime.fromDate(selectedDay);
        this.$emit("selected-day", DateTime.fromDate(selectedDay));
    }

    @Watch(nameof((datePicker: DatePicker) => datePicker.startDate))
    onStartDateChanged(): void {
        this.currentDate = this.startDate ?? this.currentDate;
    }

    get previousButton(): boolean {
        if (this.startDate) {
            return this.startDate > this.currentDate.fullMonthWeeks[0];
        } else {
            return false;
        }
    }
}