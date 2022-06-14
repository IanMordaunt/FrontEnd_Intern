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