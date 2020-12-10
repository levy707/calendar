<template>
  <form class="booking-form">
    <div class="booking-form__price">{{ price }} zł</div>
    <div class="booking-form__grade">
      <div class="booking-form__grade-rating">
        <i v-for="index in maxVoteNumber" :class="['icon', getVoteClass(index)]" :key="`booking-form_${index}`"></i>
      </div>
      <div class="booking-form__grade-votes">{{ votes }}</div>
    </div>
    <range-picker :blocked-dates="blockedDates" />
  </form>
</template>

<script>
import RangePicker from '@/components/FormsElements/RangePicker';
export default {
  name: 'BookingForm',
  components: { RangePicker },
  props: {
    price: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    votes: {
      type: Number,
      default: 0,
    },
    blockedDates: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      maxVoteNumber: 5,
    };
  },
  methods: {
    getVoteClass(currentValue) {
      if (!this.rate || !currentValue) return 'icon-star-empty';
      if (currentValue - this.rate <= 0) {
        return 'icon-star-full';
      } else if (Math.round(currentValue - this.rate) < 1) {
        return 'icon-star-half';
      } else {
        return 'icon-star-empty';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.booking-form {
  width: 416px;
  margin-top: 50px;
  padding: 20px 25px;
  border: 1px solid $Gainsboro;

  &__price {
    margin-bottom: 2px;
    font-size: 24px;
    font-weight: 700;
  }

  &__grade {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid $Gainsboro;

    &-rating {
      padding-right: 6px;
      font-size: 12px;
      color: $Ming;
    }

    &-votes {
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>
