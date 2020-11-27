<template>
    <nav class="mt-20 mb-20">
        <ul :id="generatePaginationID" class="pagination_module__1NBfW">
            <li v-show="paged!=1" class="pagination_pageItem__3SatM prev">
                <a href="#" class="pagination_pageLink__2UQhK" @click.prevent="switchPage('prev')" rel="canonical"><i class="la la-angle-left"></i></a>
            </li>
            <li v-for="order in aNumPages" :class="paginationItemClass(order)">
                <a v-if="order!='x'" href="#" @click.prevent="switchPage(order)" class="pagination_pageLink__2UQhK" rel="canonical">{{order}}</a>
                <span v-else class="pagination_pageLink__2UQhK"><i class="la la-ellipsis-h"></i></span>
            </li>
            <li v-show="paged!=maxPages" class="pagination_pageItem__3SatM"><a @click.prevent="switchPage('next')" href="#" class="pagination_pageLink__2UQhK" rel="canonical"><i class="la la-angle-right"></i></a></li>
        </ul>
    </nav>
</template>

<script type="text/x-template">
    export default{
        data(){
            return {
                aPages: [],
                paged: this.currentPage
            }
        },
        computed: {
            generatePaginationID(){
                return WHITE_LABEL+'-search-pagination';
            },
            aNumPages(){
                let aPages = [];

                if ( this.maxPages <= 1 ){
                    return aPages;
                }

                if ( this.maxPages <= 8 ){
                    for ( let i = 1; i <= this.maxPages; i++ ){
                        aPages.push(i);
                    }
                }else{
                    if ( this.paged <= 3 ){
                        // If the current page is smaller than 4, We print the first three pages and the last page
                        aPages = [1, 2, 3, 4, 'x', this.maxPages];
                    }else if(this.paged < 7){
                        // if the current page is smaller than 7, We print the first seven pages and the last page
                        aPages = [1, 2, 3, 4, 5, 6, 7, 'x', this.maxPages];
                    }else{
                        // And, in the last casfe, We print the first three pages and the pages range of [currentPage-3, currentPage]
                        aPages = [1, 'x'];

                        for ( let i = 2;  i >= 0; i--  ){
                            aPages.push(this.paged-i);
                        }

                        let currentToLast = this.maxPages - this.paged;
                        if ( currentToLast <= 8 ){
                            for ( let j = this.paged+1; j <= this.maxPages ; j++ ){
                                aPages.push(j);
                            }
                        }else{
                            for ( let j = 0; j <= 2 ; j++ ){
                                aPages.push(this.paged+1+j);
                            }

                            aPages.push('x');
                            aPages.push(this.maxPages);
                        }
                    }
                }

                return aPages;
            }
        },
        props: ['currentPage', 'maxPages'],
        methods: {
            focusUpdatePage(){
                this.$parent.$on('focus-update-current-page', (page=>{
                    this.paged = page;
                }));
            },
            paginationItemClass(order){
                if ( order == 'x' ){
                    return 'pagination_pageItem__3SatM disable';
                }else if ( order == this.paged ){
                    return 'pagination_pageItem__3SatM current';
                }else{
                    return 'pagination_pageItem__3SatM';
                }
            },
            switchPage(info){
                if ( info == 'prev' ){
                    this.paged -= 1;
                }else if(info == 'next'){
                    this.paged += 1;
                }else{
                    this.paged = info;
                }

                this.$emit('onSwitchPage', this.paged);
            }
        },
        mounted(){
            this.focusUpdatePage();
        }
    }
</script>
