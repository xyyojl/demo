<template>
    <div @click="handleClick" class="title">
        {{ message }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'hello world'
        }
    },
    methods: {
        handleClick() {
            this.message = 'hello vue';
        }
    }
}
</script>

<style>
.title {
    background: red;
}
</style>