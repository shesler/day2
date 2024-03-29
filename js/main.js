let eventBus = new Vue()

Vue.component('column', {
    template: `
 
        <div class="columns">
            <newCard></newCard>
            <p class="error" v-for="error in errors">{{ error }}</p>
            
            <p class="head_tabl">NOTES</p>
                <column_1 :column_2="column_2" :column_1="column_1" @blocked="block"></column_1>
                <column_2 :column_2="column_2"></column_2>
                <column_3 :column_3="column_3"></column_3>
        </div>
    `,
    data() {
        return {
            isBlock: false,
            column_1: [],
            column_2: [],
            column_3: [],
            errors: [],
        }

    },
    mounted() {
        this.column_1 = JSON.parse(localStorage.getItem('column_1')) || [];
        this.column_2 = JSON.parse(localStorage.getItem('column_2')) || [];
        this.column_3 = JSON.parse(localStorage.getItem('column_3')) || [];
        eventBus.$on('addColumn_1', ColumnCard => {
            if (this.column_1.length < 3) {
                this.errors.length = 0
                this.column_1.push(ColumnCard)
                this.saveColumn_1();
            } else {
                this.errors.length = 0
                this.errors.push("Follow previous notes!")
            }
        })
        eventBus.$on('addColumn_2', ColumnCard => {
            if (this.column_2.length < 5) {
                this.errors.length = 0
                this.column_2.push(ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 1)
                this.saveColumn_1();
                this.saveColumn_2();

            } else {
                this.errors.length = 0
                this.errors.push("Follow previous notes!")
            }
        })
        eventBus.$on('addColumn_3', ColumnCard => {
            ColumnCard.date = new Date().toLocaleString()
            this.column_3.push(ColumnCard)
            this.column_2.splice(this.column_2.indexOf(ColumnCard), 1)
            this.saveColumn_2();
            this.saveColumn_3();

        })
    },

    watch: {
        isBlock(val) {
            if(val === true) {

            }
        }
    },

    methods: {
        block() {
            this.isBlock = true;
        }, // момент когда второй заполнен и в первом есть > 50% заметки
        saveColumn_1(){
            localStorage.setItem('column_1', JSON.stringify(this.column_1));
        },
        saveColumn_2(){
            localStorage.setItem('column_2', JSON.stringify(this.column_2));
        },
        saveColumn_3(){
            localStorage.setItem('column_3', JSON.stringify(this.column_3));
        }
    }
})

Vue.component('newCard', {
    template: `
    <section id="main" class="main-alt">
    
        <form class="row" @submit.prevent="Submit">
        
        <div class="text">
            <h1 class="main_text">Your personal business assistant</h1>
            <h2>Write down your business here:</h2>
        </div>    
            
        <div class="form_control">
                
            <div class="form_name">
                <input required type="text" v-model="name" id="name" placeholder="Note title"/>
            </div>
            
            <input required type="text"  v-model="point_1" placeholder="First point"/>
            <br>
            <input required type="text"  v-model="point_2" placeholder="Second point"/>
            <br>
            <input required type="text"  v-model="point_3" placeholder="Third point"/> 
            <br>
            <input  type="text"  v-model="point_4"  placeholder="Fourth point"/>
            <br>
             <input type="text" v-model="point_5"  placeholder="Fifth point"/>
        </div>
            <div class="form_control">
                <button class="btn">SAVE</button>
            </div>
        </form>
    </section>
    `,
    data() {
        return {
            name: null,
            point_1: null,
            point_2: null,
            point_3: null,
            point_4: null,
            point_5: null,
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
                status: 0,
                errors: [],
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
            this.point_4 = null
            this.point_5 = null
        }
    }
})

Vue.component('column_1', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_one">
                <div class="card" v-for="card in column_1">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li>
                        {{ task.name }}
                        </li>
                    </ul>
                    
                </div>
            </div>
        </section>
    `,
    props: {
        column_1: {
            type: Array,
        },
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
        errors: {
            type: Array,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {

            if (task.completed === false) {
                task.completed = true
                ColumnCard.status += 1
            }

            let count = 0
            for (let i = 0; i < 5; ++i) {
                if (ColumnCard.points[i].name !== null) {
                    count++;
                }
            }

            if ((ColumnCard.status / count) * 100 >= 50 && this.column_2.length < 5) {
                eventBus.$emit('addColumn_2', ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 0)
            }

            if (this.column_2.length === 5) {
                if(this.column_1.length > 0) {
                    this.column_1.forEach(item => {
                        item.points.forEach(item => {
                            item.completed = false;
                            ColumnCard.card = 0;
                        })
                    })
                }
            }
        }
    },
})

Vue.component('column_2', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_two">
                <div class="card" v-for="card in column_2">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li >
                        {{ task.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    `,
    props: {
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            if (task.completed === false){
                task.completed = true
                ColumnCard.status += 1
            }
            let count = 0
            for (let i = 0; i < 5; ++i) {
                if (ColumnCard.points[i].name !== null) {
                    count++;
                }
            }
            if (( ColumnCard.status / count) * 100 >= 100 ) {
                eventBus.$emit('addColumn_3', ColumnCard)
                ColumnCard.date = new Date().toLocaleString()
            }
        }
    }
})

Vue.component('column_3', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_three">
                <div class="card" v-for="card in column_3">
                <h3>{{ card.name }}</h3>
                    <ul class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        <li>
                        {{ task.name }}
                        </li>
                    </ul>
                    <p>{{ card.date }}</p>
                </div>
            </div>
        </section>
    `,
    props: {
        column_3: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
})



let app = new Vue({
    el: '#app',
})
