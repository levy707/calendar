import { shallowMount } from '@vue/test-utils';

// Components
import RangePicker from '@/components/atoms/RangePicker/RangePicker.vue';

// Directives
import { clickOutside } from '@/directives/clickOutside.js';

describe('RangePicker.vue', () => {
    let wrapper;

    beforeEach(() => {
        jest.useFakeTimers();
    });

    const factory = props => {
        return shallowMount(RangePicker, {
            propsData: {
                ...props,
            },
            directives: { clickOutside },
        });
    };

    it('Show calendar', () => {
        wrapper = factory();
        wrapper.find('.range-picker-block').trigger('click');
        jest.advanceTimersByTime(0);
        expect(wrapper.vm.isCalendarVisible).toBe(true);
    });
});
