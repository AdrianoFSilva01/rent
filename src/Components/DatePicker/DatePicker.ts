import { Options, Vue } from "vue-class-component";
import { ModelSync, Prop } from "vue-property-decorator";

@Options({
    emits: ["update:modelValue", "selected-day"]
})
export default class Arrow extends Vue{
    @Prop() startDate: Date | null = null;
    currentDate: Date = new Date();
    @ModelSync("modelValue", "update:modelValue") selectedDay: Date | null = null;
    disablePreviousButton: boolean = false;
    months: Array<string> = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    weekDays: Array<string> = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    created(): void {
        this.currentDate = this.startDate ? new Date(this.startDate) : this.currentDate;
    }

    get datesToDisplay(): Array<Date> {
        const startDate: Date = this.getStartDate(this.currentDate);
        const endDate: Date = this.getEndDate(startDate);

        return this.getCalendar(startDate, endDate);
    }

    getStartDate(starDate: Date): Date {
        const date: Date = new Date(starDate.setDate(1));
        date.setDate(1 - date.getDay());
        return date;
    }

    getEndDate(startDate: Date): Date {
        const date: Date = new Date(startDate);
        date.setDate(startDate.getDate() + 6 * 7 - 1);
        return date;
    }

    getCalendar(starDate: Date, endDate: Date): Array<Date> {
        const dateArray: Array<Date> = [];

        while(starDate <= endDate) {
            dateArray.push(new Date(starDate));
            starDate.setDate(starDate.getDate() + 1);
        }

        if (this.startDate) {
            this.disablePreviousButton = dateArray[0] < new Date(this.startDate.toDateString());
        }

        return dateArray;
    }

    previousMonth(): void {
        const date: Date = new Date(this.currentDate);
        date.setMonth(date.getMonth() - 1, 1);
        this.currentDate = date;
    }

    nextMonth(): void {
        const date: Date = new Date(this.currentDate);
        date.setMonth(date.getMonth() + 1, 1);
        this.currentDate = date;
    }

    onSelectedDay(selectedDay: Date): void {
        this.selectedDay = new Date(selectedDay);
        this.currentDate = new Date(selectedDay);
        this.$emit("selected-day", new Date(selectedDay));
    }
}