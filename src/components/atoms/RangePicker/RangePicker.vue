<template>
    <div class="range-picker">
        <label class="range-picker-label">Dates</label>
        <div class="range-picker-block" @click="openCalendar()">
            <input
                v-model="checkInInput"
                :class="['range-picker-input', { selected: isFirstDatePicked }]"
                placeholder="Check In"
                type="text"
                :readonly="true"
            />
            <div class="range-picker-icon">
                <i class="icon icon-long-arrow-right"></i>
            </div>
            <input
                v-model="checkOutInput"
                :class="['range-picker-input', { selected: isSecondDatePicked }]"
                placeholder="Check Out"
                type="text"
                :readonly="true"
            />
            <Calendar
                v-if="isCalendarVisible"
                v-click-outside="closeCalendar"
                :today="today"
                :blocked-dates="convertedBlockedDates"
                :check-in-input="checkInInput"
                :check-out-input="checkOutInput"
                :is-first-date-picked="isFirstDatePicked"
                :is-second-date-picked="isSecondDatePicked"
                :is-all-dates-picked="isAllDatesPicked"
                class="calendar"
                @check-in-update="checkInUpdate($event)"
                @check-out-update="checkOutUpdate($event)"
            />
        </div>
    </div>
</template>

<script>
import { isValidDateFormat } from '@/utils/date.js';

import Calendar from '@/components/organisms/Calendar/Calendar.vue';

export default {
    name: 'RangePicker',

    components: { Calendar },

    props: {
        blockedDates: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            today: new Date(),
            checkInInput: '',
            checkOutInput: '',
            isCalendarVisible: false,
        };
    },

    computed: {
        convertedBlockedDates() {
            return [
                ...this.blockedDates
                    .map(date => {
                        if (!isValidDateFormat(date)) {
                            return '';
                        }

                        const convertedDate = new Date(date);

                        if (convertedDate.getTime() <= new Date()) {
                            return '';
                        }

                        return convertedDate;
                    })
                    .filter(Boolean)
                    .sort((a, b) => a - b),
            ];
        },

        isFirstDatePicked() {
            return !!this.checkInInput.length;
        },

        isSecondDatePicked() {
            return !!this.checkOutInput.length;
        },

        isAllDatesPicked() {
            return !!this.checkInInput.length && !!this.checkOutInput.length;
        },
    },

    watch: {
        isAllDatesPicked(isAllPicked) {
            if (isAllPicked) {
                this.isCalendarVisible = false;
            }
        },
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

        resetWhenOnlyOneDatePicked() {
            if (this.isFirstDatePicked && !this.isSecondDatePicked) {
                this.checkInInput = '';
            }
        },

        checkInUpdate(day) {
            if (isValidDateFormat(day)) {
                this.checkInInput = day;

                return;
            }

            this.checkInInput = '';
        },

        checkOutUpdate(day) {
            if (isValidDateFormat(day)) {
                this.checkOutInput = day;

                return;
            }

            this.checkOutInput = '';
        },
    },
};
</script>

<style lang="scss" scoped>
.range-picker {
    $root: &;

    #{$root}-label {
        font-size: 14px;
        font-weight: 700;
    }

    #{$root}-block {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid $Gainsboro;
        cursor: pointer;
    }

    #{$root}-input {
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

        &.selected {
            background: rgba($CaribbeanGreen, 0.3);
        }
    }

    #{$root}-icon {
        display: flex;
        padding: 0 20px;
    }
}
</style>
