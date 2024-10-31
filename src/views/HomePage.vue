<template>
    <section class="home-page">
        <BookingForm
            :price="formData.price"
            :rate="formData.rate"
            :votes="formData.votes"
            :blocked-dates="formData.blockedDates"
        />
    </section>
</template>

<script>
import BookingForm from '@/components/Forms/BookingForm.vue';

export default {
    name: 'HomePage',
    components: { BookingForm },
    data() {
        return {
            formData: {
                price: 293,
                rate: 4.59,
                votes: 123,
                blockedDates: ['2024.05.01', '2024.05.03', '2024.05.10', '2020.12.29', 'test', 0],
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
