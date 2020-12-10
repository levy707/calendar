<template>
  <section class="home-page">
    <booking-form
      :price="formData.price"
      :rate="formData.rate"
      :votes="formData.votes"
      :blocked-dates="formData.blockedDates"
    />
  </section>
</template>

<script>
import BookingForm from '@/components/Forms/BookingForm';
export default {
  name: 'HomePage',
  components: { BookingForm },
  data() {
    return {
      formData: {
        price: 293,
        rate: 4.59,
        votes: 123,
        blockedDates: ['2020.12.01', '2021.01.15', '2020.12.24', '2020.12.29', 'test', 0],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}
</style>
