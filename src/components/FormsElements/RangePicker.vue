<template>
    <div class="range-picker">
        <label class="range-picker__label">Dates</label>
        <div class="range-picker__block" @click="openCalendar()">
            <input
                v-model="checkInInput"
                :class="[
                    'range-picker__input',
                    { 'range-picker__input--selected': isFirstDatePicked },
                ]"
                placeholder="Check In"
                type="text"
                :readonly="true"
            />
            <div class="range-picker__icon">
                <i class="icon icon-long-arrow-right"></i>
            </div>
            <input
                v-model="checkOutInput"
                :class="[
                    'range-picker__input',
                    { 'range-picker__input--selected': isSecondDatePicked },
                ]"
                placeholder="Check Out"
                type="text"
                :readonly="true"
            />
            <div v-if="isCalendarVisible" v-click-outside="closeCalendar" class="calendar">
                <div class="calendar__header">
                    <button
                        :class="[
                            'calendar__header-navigation calendar__header-navigation--prev',
                            { 'calendar__header-navigation--disabled': isActualMonthVisible },
                        ]"
                        :disabled="isActualMonthVisible"
                        type="button"
                        @click="previousMonth()"
                    >
                        <i class="icon icon-chevron-left"></i>
                    </button>
                    <div class="calendar__header-title">
                        {{ currentMonthName }} {{ currentYear }}
                    </div>
                    <button
                        class="calendar__header-navigation calendar__header-navigation--next"
                        type="button"
                        @click="nextMonth()"
                    >
                        <i class="icon icon-chevron-right"></i>
                    </button>
                </div>
                <div class="calendar__body">
                    <div class="calendar__days">
                        <div
                            v-for="name in daysNames"
                            :key="`${currentMonthName}_${name}`"
                            class="calendar__days-block"
                        >
                            <div class="calendar__days-label">{{ name }}</div>
                        </div>
                    </div>
                    <div class="calendar__days">
                        <button
                            v-for="(day, index) in allDays"
                            :key="`${currentMonthName}_${index}`"
                            :class="[
                                'calendar__days-block',
                                {
                                    'calendar__days-block--hover-active': day.isHoverActive,
                                    'calendar__days-block--range-active': day.isRangeActive,
                                    'calendar__days-block--range-selected': day.isActive,
                                    'calendar__days-block--range-start': day.isStartDate,
                                    'calendar__days-block--range-end': day.isEndDate,
                                    'calendar__days-block--disabled':
                                        day.disabled || day.isTemporaryDisabled,
                                },
                            ]"
                            :disabled="day.disabled || day.isTemporaryDisabled"
                            type="button"
                            @click.stop="pickDate(day.dayNumber)"
                            @mouseenter="setHoveredDay(day.dayNumber)"
                            @mouseleave="clearHoveredDay()"
                        >
                            <span
                                :class="[
                                    'calendar__days-number',
                                    {
                                        'calendar__days-number--today': day.currentDay,
                                        'calendar__days-number--active': day.isActive,
                                    },
                                ]"
                            >
                                {{ day.dayNumber }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RangePicker',
    props: {
        blockedDates: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            checkInInput: '',
            checkOutInput: '',
            isCalendarVisible: false,
            today: new Date(),
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            hoveredDay: '',
            firstBlockedDate: '',
            daysNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            currentMonthDays: [],
            emptyStartDays: [],
            emptyEndDays: [],
        };
    },
    computed: {
        convertedBlockedDates() {
            return [
                ...this.blockedDates
                    .filter(date => {
                        if (typeof date !== 'string') {
                            return;
                        }

                        const convertedDate = new Date(date);

                        if (!(convertedDate instanceof Date) || Number.isNaN(convertedDate)) {
                            return;
                        }

                        return date;
                    })
                    .map(date => new Date(date))
                    .filter(date => date && new Date(date).getTime() > this.today)
                    .sort((a, b) => a - b),
            ];
        },
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
        isFirstDatePicked() {
            return !!this.checkInInput.length;
        },
        isSecondDatePicked() {
            return !!this.checkOutInput.length;
        },
        isAllDatesPicked() {
            return this.isFirstDatePicked && this.isSecondDatePicked;
        },
    },
    watch: {
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
            this.markPickedDay(new Date(value));
        },
        checkOutInput(value) {
            this.markPickedDay(new Date(value), false);
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
    },
    methods: {
        openCalendar() {
            setTimeout(() => {
                this.isCalendarVisible = true;
            }, 0);
        },
        closeCalendar() {
            this.isCalendarVisible = false;
            this.resetWhenOnlyOneDatePicked();
        },
        getCurrentMonth(date) {
            return this.currentYear === date.getFullYear() && this.currentMonth === date.getMonth();
        },
        nextMonth() {
            this.currentYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
            this.currentMonth = (this.currentMonth + 1) % 12;
        },
        previousMonth() {
            this.currentYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
            this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        },
        pickDate(day) {
            if (!this.isFirstDatePicked) {
                this.checkInInput = this.getDateFormatToInput(day);
                this.showOnlyAvailableCheckoutDates(this.checkInInput);

                return;
            }

            if (this.isFirstDatePicked && !this.isSecondDatePicked) {
                if (
                    new Date(this.getDateFormatToInput(day)).getTime() <
                    new Date(this.checkInInput).getTime()
                ) {
                    this.initMonthArray();
                    this.checkOutInput = '';
                    this.checkInInput = this.getDateFormatToInput(day);
                    this.showOnlyAvailableCheckoutDates(this.checkInInput);
                } else {
                    this.checkOutInput = this.getDateFormatToInput(day);
                    this.hoveredDay = '';
                    this.resetCheckoutDates();
                }
            } else {
                this.initMonthArray();
                this.checkOutInput = '';

                // If picked the same start day mark it again
                if (this.getDateFormatToInput(day) === this.checkInInput) {
                    this.checkInInput = this.getDateFormatToInput(day);
                    this.markPickedDay(new Date(this.getDateFormatToInput(day)));
                } else {
                    this.checkInInput = this.getDateFormatToInput(day);
                }

                this.showOnlyAvailableCheckoutDates(this.checkInInput);
            }
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
            const nextBlockedDates = this.convertedBlockedDates.filter(
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
            let i = 1;

            while (i <= maxDays) {
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
                i += 1;
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
            if (this.convertedBlockedDates.length <= 0) {
                return;
            }

            // Filtered only days from current month
            const blockedDays = this.convertedBlockedDates
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
        resetWhenOnlyOneDatePicked() {
            if (this.isFirstDatePicked && !this.isSecondDatePicked) {
                this.checkInInput = '';
                this.initMonthArray();
            }
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

<style lang="scss" scoped>
.range-picker {
    &__label {
        font-size: 14px;
        font-weight: 700;
    }

    &__block {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid $Gainsboro;
        cursor: pointer;
    }

    &__input {
        display: flex;
        width: 100%;
        padding: 4px 8px;
        border: 0;
        font-size: 14px;
        color: $Charcoal;
        background: transparent;
        cursor: pointer;

        &:focus {
            outline: none;
        }

        &--selected {
            background: rgba($CaribbeanGreen, 0.3);
        }
    }

    &__icon {
        display: flex;
        padding: 0 20px;
    }
}

.calendar {
    $root: &;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    background: $White;
    cursor: default;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 15px 20px;
        font-size: 26px;
        background: $CaribbeanGreen;
        color: $White;

        &-navigation {
            $navigation: &;
            font-size: 18px;
            color: $Charcoal;
            background: transparent;
            border: 0;
            cursor: pointer;

            &:focus {
                outline: none;
            }

            &#{$navigation}--disabled {
                opacity: 0.3;
                cursor: default;
            }
        }

        &-title {
            text-transform: capitalize;
        }
    }

    &__body {
        display: flex;
        flex-direction: column;
        padding: 5px 10px;
    }

    &__days {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    &__days-block {
        $daysBlock: &;
        position: relative;
        display: flex;
        justify-content: center;
        width: calc(100% / 7);
        padding: 0 3px;
        margin: 3px 0;
        border: 0;
        background: transparent;
        cursor: pointer;

        &:focus {
            outline: none;
        }

        &:not(#{$daysBlock}--disabled) {
            &:hover {
                #{$root}__days-number {
                    background: $HummingBird;

                    &#{$root}__days-number--active {
                        background: $CaribbeanGreen;
                    }
                }
            }
        }

        &#{$daysBlock}--disabled {
            color: $Gainsboro;
            cursor: default;
        }

        &#{$daysBlock}--range-active,
        &#{$daysBlock}--hover-active {
            &:not(#{$daysBlock}--range-selected) {
                #{$root}__days-number {
                    color: $CaribbeanGreen;
                }
            }

            &:before {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                border-radius: 0;
                background: $HummingBird;
                color: $White;
                content: '';
                z-index: 0;
            }

            &#{$daysBlock}--hover-active {
                &:hover {
                    &:before {
                        width: 50%;
                    }
                }
            }

            &#{$daysBlock}--range-start {
                &:before {
                    left: auto;
                    right: 0;
                    width: 50%;
                }
                &#{$daysBlock}--range-end {
                    &:before {
                        display: none;
                    }
                }
            }

            &#{$daysBlock}--range-end {
                &:before {
                    width: 50%;
                }
            }
        }
    }

    &__days-label {
        padding: 16px 0;
        font-size: 14px;
        color: $Gainsboro;
        font-weight: 700;
    }

    &__days-number {
        $days: &;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border: 2px solid transparent;
        border-radius: 50%;
        font-size: 14px;
        z-index: 1;

        &#{$days}--today {
            border-color: $CaribbeanGreen;
            color: $CaribbeanGreen;
        }

        &#{$days}--active {
            border-color: $CaribbeanGreen;
            background: $CaribbeanGreen;
            color: $White;
        }
    }
}
</style>
