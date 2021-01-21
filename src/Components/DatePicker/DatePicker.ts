import DateTime from "@/Extensions/Types/DateTime/DateTime";
import WeekDays from "@/Extensions/Types/DateTime/WeekDays";
import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop } from "vue-property-decorator";

@Options({
    emits: ["update:modelValue"],
    enums: {
        WeekDays
    }
})
export default class DatePicker extends Vue{
    @ModelSync("modelValue", "update:modelValue") selectedDay: DateTime | null = null;
    @Prop() startDate: DateTime | null = null;

    private _date: DateTime = new DateTime();

    get currentDate(): DateTime {
        this.reset();

        return this._date || new DateTime();
    }

    reset(): void {
        if (this.selectedDay) {
            this._date = new DateTime(this.selectedDay);
        } else if(this.startDate) {
            this._date = new DateTime(this.startDate);
        }
    }

    onSelectedDay(selectedDay: DateTime): void {
        this.selectedDay = new DateTime(selectedDay);
    }

    get previousButton(): boolean {
        if (this.startDate) {
            return this.startDate > this.currentDate.fullMonthWeeks[0];
        } else {
            return false;
        }
    }
}