Vue.component('ChildComponent', {
    props: ['text'],
    data() {
        return {
            message: 'pass me down'
        }
    },
    template: '<div>{{text}}<div>',
    mounted() {
        console.log("CHILD MOUNTED")
    }
});

var app = new Vue({
    el: '#app',
    data: {
        message: ''
    },
    created() {
        console.log('app mounted')
        const bc = new BroadcastChannel("dataShare");
        // Handle incoming messages
        bc.addEventListener('message', e => {
            console.log(e.data);
            this.text = e.data
        });
        // Send message
        bc.postMessage("This is a test!");
    },
    methods: {
        but: function () {
            this.message = Number(this.message) * 2
        }
    }
});