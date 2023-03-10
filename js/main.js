let app = new Vue ({
    el: '#app',
})


let eventBus = new Vue()


Vue.component('column', {
    template: `
        <div class="columns">
            <newCard></newCard>
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


Vue.component('newCard', {
    template: `
        <section class="main_alt" id="main">
            <form class="row" @submit.prewent="Submit">
                <div class="textarea">
                    <h1 class="main_text">Менеджер вашего прогрсса</h1>
                    <h2>Запишите ваши планы сюда:</h2>
                </div>
                <div class="form_d">
                        <div class="form_name">
                        <input required type="text" v-model="name" id="name" placeholder="Введите название заметки"/>
                        </div>
                        <input required type="text"  v-model="point_1" placeholder="Первый пункт"/>
                        <br>
                        <input required type="text"  v-model="point_2" placeholder="Второй пункт"/>
                        <br>
                        <input required type="text"  v-model="point_3" placeholder="Третий пункт"/> 
                        <br>
                        <input  type="text"  v-model="point_4"  placeholder="Четвертый пункт"/>
                        <br>
                        <input type="text" v-model="point_5"  placeholder="Пятый пункт"/>
                </div>
                <div class="form_d">
                    <button class="btn">Сохранить</button>
                </div>
            </form>
        </section>
    `,
    data() {
        return {
            name: null,
            point1: null,
            point2: null,
            point3: null,
            point4: null,
            point5: null,
            date: null,
        }
    },
    methods: {
        Submit() {
            let card = {
                name: this.name,
                points: [
                    {name: this.point_1, completed: false},
                    {name: this.point_2, completed: false},
                    {name: this.point_3, completed: false},
                    {name: this.point_4, completed: false},
                    {name: this.point_5, completed: false}
                ],
                date: null,
                status: null,
                errors: []
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
            this.point_4 = null
            this.point_5 = null
        }
    }
})
