import Months from "./Months";
import WeekDays from "./WeekDays";

export default class DateTime {
    private _date: Date;
    private _fullMonthWeeks: Array<DateTime> = [];

    constructor(day?: number, month?: number, year?: number) {
        if(day && month && year) {
            this._date = new Date(year, month - 1, day);
        } else {
            this._date = new Date();
        }
        this._date.setHours(0,0,0,0);
    }

    static fromDate(dateTime: DateTime): DateTime {
        return new DateTime(dateTime.Day, dateTime.Month, dateTime.Year);
    }

    get Day(): number {
        return this._date.getDate();
    }

    get Month(): number {
        return this._date.getMonth() + 1;
    }

    get MonthName(): string {
        return Object.values(Months)[this.Month - 1]
    }

    get Year(): number {
        return this._date.getFullYear();
    }

    get WeekDay(): number {
        return this._date.getDay();
    }

    get WeekDayName(): string {
        return Object.values(WeekDays)[this.WeekDay]
    }

    get fullMonthWeeks(): Array<DateTime> {
        if (!this._fullMonthWeeks.length) {
            this.loadMonth();
        }
        return this._fullMonthWeeks;
    }

    firstDay(): DateTime {
        this._date.setDate(1);
        return this;
    }

    lastDay(): DateTime {
        this._date.setMonth(this._date.getMonth() + 1, 0);
        return this;
    }

    nextDay(days?: number): DateTime {
        const numberOfDays: number = days ?? 1;
        this._setDay(numberOfDays);
        return this;
    }

    previousDay(days?: number): DateTime {
        const numberOfDays: number = days ?? 1;
        this._setDay(-numberOfDays);
        return this;
    }

    private _setDay(numberOfDays: number): DateTime {
        this._date.setDate(this._date.getDate() + numberOfDays);
        return this;
    }

    previousMonth(): DateTime {
        const currentDate: Date = new Date(this._date.setMonth(this._date.getMonth() - 1, 1));
        this._date = currentDate;
        this.loadMonth();
        return this;
    }

    nextMonth(): DateTime {
        const currentDate: Date = new Date(this._date.setMonth(this._date.getMonth() + 1, 1));
        this._date = currentDate;
        this.loadMonth();
        return this;
    }

    loadMonth(): void {
        const startDate: DateTime = this.getStartDate(this);
        const endDate: DateTime = this.getEndDate(startDate);

        this._fullMonthWeeks = this.getCalendar(startDate, endDate);
    }

    getStartDate(startDate: DateTime): DateTime {
        const date: DateTime = DateTime.fromDate(startDate);
        date.firstDay().previousDay(date.WeekDay);
        return date;
    }

    getEndDate(startDate: DateTime): DateTime {
        return DateTime.fromDate(startDate).nextDay(6 * 7 - 1);
    }

    getCalendar(startDate: DateTime, endDate: DateTime): Array<DateTime> {
        const dateArray: Array<DateTime> = [];

        while(startDate <= endDate) {
            dateArray.push(DateTime.fromDate(startDate));
            startDate.nextDay();
        }

        return dateArray;
    }

    equals(dateTime: DateTime): boolean {
        return this._date.toDateString() === dateTime._date.toDateString()
    }

    [Symbol.toPrimitive](): number {
        return this._date.getTime();
    }
}