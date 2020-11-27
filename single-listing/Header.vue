<template>
    <header class="content-box_header__xPnGx clearfix">
        <div class="wil-float-left">
            <h4 class="content-box_title__1gBHS"><i :class="settings.icon"></i><span>{{settings.name}}</span></h4>
        </div>
    </header>
</template>

<script>
    export default{
        props: ['settings']
    }
</script>
