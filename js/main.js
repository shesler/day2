let app = new Vue ({
    el: '#app',
})


let eventBus = new Vue()


Vue.component('column', {
    template: `
        <div class="columns">
            <p class="head_of_tab1"></p>
            <p class="error" v-for="error in errors">{{ error }}</p>
                <column_1 :column_1="column_1"></column_1>
                <column_2 :column_2="column_2"></column_2>
                <column_3 :column_3="column_3"></column_3>
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
            if (this.column_1.length < 3) {
                this.errors.length = 0
                this.column_1.push(ColumnCard)
            } else {
                this.errors.length = 0
                this.errors.push()
            }
        })
        eventBus.$on('addColumn_2', ColumnCard => {
            if (this.column_2.length < 5) {
                this.errors.length = 0
                this.column_2.push(ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard),1)
            } else {
                this.errors.length = 0
                this.errors.push()
            }
        })
        eventBus.$on('addColumn_3', ColumnCard => {
            this.column_3.push(ColumnCard)
            this.column_2.splice(this.column_2.indexOf(ColumnCard),1)
        })
    }
})