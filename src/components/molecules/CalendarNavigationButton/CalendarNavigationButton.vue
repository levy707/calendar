<template>
    <button
        :class="['calendar-navigation-button', { disabled: isDisabled }]"
        :disabled="isDisabled"
        type="button"
        @click="navigationClick()"
    >
        <slot />
    </button>
</template>

<script>
export default {
    name: 'CalendarNavigationButton',

    props: {
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        navigationClick() {
            this.$emit('navigation-click');
        },
    },
};
</script>

<style scoped lang="scss">
.calendar-navigation-button {
    font-size: 18px;
    color: $Charcoal;
    background: transparent;
    border: 0;
    cursor: pointer;

    &:focus {
        outline: none;
    }

    &.disabled {
        opacity: 0.3;
        cursor: default;
    }
}
</style>
