<template>
    <div class="promo-item_group__2ZJhC">
        <h3 class="promo-item_title__3hfHG" v-if="title!==''" v-html="title"></h3>
        <p class="promo-item_description__2nc26" v-if="desc!==''" v-html="desc"></p>
    </div>
</template>
<script>
    export default{
        props: {
            title: {
                type: String,
                value: ''
            },
            desc: {
                type: String,
                value: ''
            }
        }
    }
</script>
