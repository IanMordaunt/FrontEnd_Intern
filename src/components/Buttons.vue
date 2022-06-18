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
      default: 'Add or Subtract',
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
    <div class="buttons">
    <button>Add</button>
    <button>Subtract</button>
    </div>
    <h1 class="green">{{ msg }}</h1>
  </div>
</template>