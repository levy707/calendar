import { shallowMount } from '@vue/test-utils';

// Components
import RangePicker from '@/components/FormsElements/RangePicker';

// Directives
import clickOutside from '@/directives/clickOutside';

describe('RangePicker.vue - Navigation', () => {
  let wrapper;

  function mountComponent(propsData = {}) {
    wrapper = shallowMount(RangePicker, { directives: { clickOutside }, propsData });
    wrapper.setData({
      today: new Date('2020.12.10'),
      currentMonth: new Date('2020.12.10').getMonth(),
      currentYear: new Date('2020.12.10').getFullYear(),
    });
  }

  beforeEach(() => mountComponent());

  jest.useFakeTimers();
  it('Show calendar', () => {
    wrapper.find('.range-picker__block').trigger('click');
    jest.advanceTimersByTime(0);
    expect(wrapper.vm.isCalendarVisible).toBe(true);
  });

  it('Show next month', () => {
    wrapper.find('.range-picker__block').trigger('click');
    jest.advanceTimersByTime(0);
    wrapper.vm.$nextTick(() => {
      wrapper.find('.calendar__header-navigation--next').trigger('click');
      expect(wrapper.vm.currentMonthName).toBe('January');
    })
  })

  it('Show previous month', () => {
    wrapper.setData({
      today: new Date('2020.11.10'),
      currentMonth: new Date('2020.12.10').getMonth(),
      currentYear: new Date('2020.12.10').getFullYear(),
    });
    wrapper.find('.range-picker__block').trigger('click');
    jest.advanceTimersByTime(0);
    wrapper.vm.$nextTick(() => {
      wrapper.find('.calendar__header-navigation--prev').trigger('click');
      expect(wrapper.vm.currentMonthName).toBe('November');
    })
  })

  it('Blocked navigation to previous month', () => {
    wrapper.find('.range-picker__block').trigger('click');
    jest.advanceTimersByTime(0);
    wrapper.vm.$nextTick(() => {
      wrapper.find('.calendar__header-navigation--prev').trigger('click');
      expect(wrapper.vm.currentMonthName).toBe('December');
    })
  })
});
