let app = new Vue ({
    el: '#app',
})


let eventBus = new Vue()


Vue.component('column', {
    template: `
        <div class="columns">
            <p class="head_of_tab1"></p>
        </div> 
        
    
    
    
    
    
    
    `,
    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
            errors: []
        }
    },
    mounted() {
        eventBus.$on('addColumn_1', ColumnCard => {

        })
    }

})