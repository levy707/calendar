<template>
    <div class="calendar-header">
        <CalendarNavigationButton
            class="navigate-prev"
            :is-disabled="isPrevNavigationDisabled"
            @navigation-click="prevMonthClick()"
        >
            <slot name="prevIcon"></slot>
        </CalendarNavigationButton>
        <div class="title">{{ currentMonthName }} {{ currentYear }}</div>
        <CalendarNavigationButton class="navigate-next" @navigation-click="nextMonthClick()">
            <slot name="nextIcon"></slot>
        </CalendarNavigationButton>
    </div>
</template>

<script>
import CalendarNavigationButton from '@/components/molecules/CalendarNavigationButton/CalendarNavigationButton.vue';

export default {
    name: 'CalendarHeader',

    components: { CalendarNavigationButton },

    props: {
        currentMonthName: {
            type: String,
            default: '',
        },

        currentYear: {
            type: Number,
            default: 0,
        },

        isPrevNavigationDisabled: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        prevMonthClick() {
            this.$emit('prev-month-click');
        },

        nextMonthClick() {
            this.$emit('next-month-click');
        },
    },
};
</script>

<style scoped lang="scss">
.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 15px 20px;
    font-size: 26px;
    background: $CaribbeanGreen;
    color: $White;

    .title {
        text-transform: capitalize;
    }
}
</style>
