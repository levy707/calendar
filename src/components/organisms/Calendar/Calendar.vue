<template>
    <div class="calendar">
        <CalendarHeader
            :current-month-name="currentMonthName"
            :current-year="currentYear"
            :is-prev-navigation-disabled="isActualMonthVisible"
            @prev-month-click="previousMonth()"
            @next-month-click="nextMonth()"
        >
            <template #prevIcon>
                <i class="icon icon-chevron-left"></i>
            </template>
            <template #nextIcon>
                <i class="icon icon-chevron-right"></i>
            </template>
        </CalendarHeader>
        <div class="calendar-body">
            <div class="days">
                <div
                    v-for="name in daysNames"
                    :key="`${currentMonthName}_${name}`"
                    class="days-block"
                >
                    <div class="days-label">{{ name }}</div>
                </div>
            </div>
            <div class="days">
                <CalendarDayButton
                    v-for="(day, index) in allDays"
                    :key="`${currentMonthName}_${index}`"
                    :day="day"
                    @pick-date="pickDate($event)"
                    @set-hovered-day="setHoveredDay($event)"
                    @clear-hovered-day="clearHoveredDay()"
                />
            </div>
        </div>
    </div>
</template>

<script>
import CalendarHeader from '@/components/atoms/CalendarHeader/CalendarHeader.vue';
import CalendarDayButton from '@/components/molecules/CalendarDayButton/CalendarDayButton.vue';

export default {
    name: 'Calendar',

    components: { CalendarDayButton, CalendarHeader },

    props: {
        today: {
            type: Date,
            default: new Date(),
        },

        blockedDates: {
            type: Array,
            default: () => [],
        },

        checkInInput: {
            type: String,
            default: '',
        },

        checkOutInput: {
            type: String,
            default: '',
        },

        isFirstDatePicked: {
            type: Boolean,
            default: false,
        },

        isSecondDatePicked: {
            type: Boolean,
            default: false,
        },

        isAllDatesPicked: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            currentMonth: this.today.getMonth(),
            currentYear: this.today.getFullYear(),
            daysNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            hoveredDay: '',
            firstBlockedDate: '',
            currentMonthDays: [],
            emptyStartDays: [],
            emptyEndDays: [],
        };
    },

    computed: {
        currentMonthName() {
            return new Date(`${this.currentYear}, ${this.currentMonth + 1}`).toLocaleString('en', {
                month: 'long',
            });
        },

        currentMonthFirstDay() {
            return new Date(this.currentYear, this.currentMonth).getDay();
        },

        currentMonthDaysNumber() {
            return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        },

        isActualMonthVisible() {
            return this.getCurrentMonth(this.today);
        },

        allDays() {
            return [...this.emptyStartDays, ...this.currentMonthDays, ...this.emptyEndDays];
        },
    },

    watch: {
        today(date) {
            this.currentMonth = date.getMonth();
            this.currentYear = date.getFullYear();
        },

        currentMonth() {
            this.initMonthArray();
            this.markPickedDay(new Date(this.checkInInput));
            this.markPickedDay(new Date(this.checkOutInput), false);

            if (this.isAllDatesPicked) {
                this.markRangedDays();
            }

            if (this.firstBlockedDate) {
                this.showOnlyAvailableCheckoutDates(this.checkInInput);
            }
        },

        checkInInput(value) {
            if (this.isSecondDatePicked) {
                this.$emit('check-out-update', '');
                this.initMonthArray();
                this.markPickedDay(new Date(value));

                return;
            }

            this.markPickedDay(new Date(value));
            this.showOnlyAvailableCheckoutDates(value);
        },

        checkOutInput(value) {
            this.markPickedDay(new Date(value), false);

            if (!value) {
                this.showOnlyAvailableCheckoutDates(this.checkInInput);

                return;
            }

            this.hoveredDay = '';
            this.resetCheckoutDates();
        },

        isAllDatesPicked(value) {
            if (value) {
                this.markRangedDays();
            }
        },

        hoveredDay(hoveredDay) {
            this.currentMonthDays = this.currentMonthDays.map(day => {
                day.isHoverActive =
                    day.dateDay <= hoveredDay && day.dateDay >= new Date(this.checkInInput);

                return day;
            });
        },
    },

    mounted() {
        this.initMonthArray();
        this.addSelectedDaysToMonthArray();
    },

    methods: {
        nextMonth() {
            this.currentYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
            this.currentMonth = (this.currentMonth + 1) % 12;
        },

        previousMonth() {
            this.currentYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
            this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        },

        pickDate(day) {
            if (this.isFirstDatePicked && !this.isSecondDatePicked) {
                this.$emit('check-out-update', this.getDateFormatToInput(day));

                return;
            }

            // If picked the same start day mark it again
            if (this.getDateFormatToInput(day) === this.checkInInput) {
                this.$emit('check-out-update', '');
                this.initMonthArray();
                this.markPickedDay(new Date(this.getDateFormatToInput(day)));
            }

            this.$emit('check-in-update', this.getDateFormatToInput(day));
        },

        getCurrentMonth(date) {
            return this.currentYear === date.getFullYear() && this.currentMonth === date.getMonth();
        },

        getDateFormatToInput(day) {
            return `${this.currentYear}.${(this.currentMonth + 1).toString().padStart(2, '0')}.${day
                .toString()
                .padStart(2, '0')}`;
        },

        markPickedDay(date, isStartDate = true) {
            if (!this.getCurrentMonth(date)) {
                return;
            }

            this.currentMonthDays[date.getDate() - 1].isActive = true;

            if (isStartDate) {
                this.currentMonthDays[date.getDate() - 1].isStartDate = true;

                return;
            }

            this.currentMonthDays[date.getDate() - 1].isEndDate = true;
        },

        markRangedDays() {
            this.currentMonthDays = this.currentMonthDays.map(day => {
                if (
                    new Date(day.dateDay).getTime() >= new Date(this.checkInInput) &&
                    new Date(day.dateDay).getTime() <= new Date(this.checkOutInput)
                ) {
                    day.isRangeActive = true;
                }

                return day;
            });
        },

        setFirstBlockedDate(pickedDate) {
            const nextBlockedDates = this.blockedDates.filter(
                date => new Date(pickedDate).getTime() < date.getTime()
            );

            if (nextBlockedDates.length) {
                this.firstBlockedDate = nextBlockedDates.at(0);
            }
        },

        showOnlyAvailableCheckoutDates(pickedDate) {
            this.setFirstBlockedDate(pickedDate);
            this.currentMonthDays = this.currentMonthDays.map(day => {
                if (
                    day.dateDay.getTime() < new Date(pickedDate).getTime() ||
                    (!!this.firstBlockedDate &&
                        day.dateDay.getTime() > this.firstBlockedDate.getTime())
                ) {
                    day.isTemporaryDisabled = true;
                }

                return day;
            });
        },

        resetCheckoutDates() {
            this.firstBlockedDate = '';
            this.currentMonthDays = this.currentMonthDays.map(day => {
                day.isTemporaryDisabled = false;

                return day;
            });
        },

        addDays(array, maxDays, type = 'day') {
            for (let i = 1; i <= maxDays; i++) {
                array.push({
                    dayNumber: type === 'day' ? i : '',
                    dateDay: new Date(`${this.currentYear}.${this.currentMonth + 1}.${i}`),
                    className: [type],
                    disabled: type === 'empty',
                    isTemporaryDisabled: false,
                    isActive: false,
                    isStartDate: false,
                    isEndDate: false,
                    isRangeActive: false,
                    isHoverActive: false,
                });
            }
        },

        setHoveredDay(day) {
            if (
                this.isFirstDatePicked &&
                !this.isSecondDatePicked &&
                new Date(this.checkInInput).getTime() <
                    new Date(this.currentYear, this.currentMonth, day).getTime()
            ) {
                this.hoveredDay = new Date(this.currentYear, this.currentMonth, day);
            }
        },

        clearHoveredDay() {
            if (this.isFirstDatePicked && !this.isSecondDatePicked) {
                this.hoveredDay = '';
            }
        },

        addPastDisabledDateToMonthArray() {
            if (!this.isActualMonthVisible) {
                return;
            }

            const currentDay = this.today.getDate();

            this.currentMonthDays = this.currentMonthDays.map(day => {
                return day.dayNumber < currentDay ? { ...day, disabled: true } : { ...day };
            });
        },

        addCustomDisabledDateToMonthArray() {
            if (this.blockedDates.length <= 0) {
                return;
            }

            // Filtered only days from current month
            const blockedDays = this.blockedDates
                .filter(date => this.getCurrentMonth(date))
                .map(date => date.getDate());

            if (blockedDays.length > 0) {
                blockedDays.forEach(dayNumber => {
                    this.currentMonthDays[dayNumber - 1].disabled = true;
                });
            }
        },

        addCurrentDateToMonthArray() {
            if (!this.isActualMonthVisible) {
                return;
            }

            const currentDay = this.today.getDate();

            this.currentMonthDays = this.currentMonthDays.map(day => {
                return day.dayNumber === currentDay ? { ...day, currentDay: true } : { ...day };
            });
        },

        addSelectedDaysToMonthArray() {
            if (!this.isAllDatesPicked) {
                return;
            }

            this.markPickedDay(new Date(this.checkInInput));
            this.markPickedDay(new Date(this.checkOutInput), false);
            this.markRangedDays();
        },

        resetDays() {
            this.currentMonthDays = [];
            this.emptyStartDays = [];
            this.emptyEndDays = [];
        },

        initMonthArray() {
            this.resetDays();
            this.addDays(this.emptyStartDays, this.currentMonthFirstDay, 'empty');
            this.addDays(this.currentMonthDays, this.currentMonthDaysNumber);

            if (this.allDays.length % 7 > 0) {
                this.addDays(this.emptyEndDays, 7 - (this.allDays.length % 7), 'empty');
            }

            this.addCurrentDateToMonthArray();
            this.addPastDisabledDateToMonthArray();
            this.addCustomDisabledDateToMonthArray();
        },
    },
};
</script>

<style scoped lang="scss">
.calendar {
    $root: &;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    background: $White;
    cursor: default;

    #{$root}-body {
        display: flex;
        flex-direction: column;
        padding: 5px 10px;
    }

    .days {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .days-block {
        display: flex;
        justify-content: center;
        width: calc(100% / 7);
        padding: 0 3px;
        margin: 3px 0;
    }

    .days-label {
        padding: 16px 0;
        font-size: 14px;
        color: $Gainsboro;
        font-weight: 700;
    }
}
</style>
