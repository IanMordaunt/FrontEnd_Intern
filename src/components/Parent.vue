<script>
export default {
  data() {
    return {
      localMsg: 'John',
    };
  },
  props: {
    msg: {
      type: String,
      default: 'This is a msg',
    },
  },
  methods: {
    doIt() {
      console.log(`Hello ${this.name}`);
    },
  },
  mounted() {
    const bc = new BroadcastChannel("dataShare");
    // Handle incoming messages
    bc.addEventListener('message', e => {
      console.log(e.data);
      this.text = e.data
    });
    // Send message
    bc.postMessage("This is a test!");
  },
};
</script>

<template>
  <div class="greetings">
    <h3>{{ localMsg }}</h3>
    <h1 class="green">{{ msg }}</h1>
  </div>
</template>
