import { shallowMount } from '@vue/test-utils';

// Components
import Calendar from '@/components/organisms/Calendar/Calendar.vue';

describe('Calendar.vue', () => {
    let wrapper;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const factory = props => {
        return shallowMount(Calendar, {
            propsData: {
                ...props,
            },
        });
    };

    const propsData = {
        today: new Date('2024.12.10'),
    };

    it('Show next month', () => {
        wrapper = factory(propsData);
        wrapper.vm.nextMonth();
        expect(wrapper.vm.currentMonthName).toBe('January');
    });

    it('Show previous month', () => {
        wrapper = factory(propsData);
        wrapper.vm.previousMonth();
        expect(wrapper.vm.currentMonthName).toBe('November');
    });
});
