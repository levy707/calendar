<template>
    <button
        :class="[
            'days-block',
            {
                'days-block--hover-active': day.isHoverActive,
                'days-block--range-active': day.isRangeActive,
                'days-block--range-selected': day.isActive,
                'days-block--range-start': day.isStartDate,
                'days-block--range-end': day.isEndDate,
                'days-block--disabled': day.disabled || day.isTemporaryDisabled,
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
                'days-number',
                {
                    'days-number--today': day.currentDay,
                    'days-number--active': day.isActive,
                },
            ]"
        >
            {{ day.dayNumber }}
        </span>
    </button>
</template>

<script>
export default {
    name: 'CalendarDayButton',

    props: {
        day: {
            type: Object,
            default: () => ({}),
        },
    },

    methods: {
        pickDate(dayNumber) {
            this.$emit('pick-date', dayNumber);
        },

        setHoveredDay(dayNumber) {
            this.$emit('set-hovered-day', dayNumber);
        },

        clearHoveredDay() {
            this.$emit('clear-hovered-day');
        },
    },
};
</script>

<style scoped lang="scss">
.days-block {
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
            #{$daysBlock} {
                background: $HummingBird;

                &#{$daysBlock}--active {
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
            #{$daysBlock} {
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

.days-number {
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
</style>
