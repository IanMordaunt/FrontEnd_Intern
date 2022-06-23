<script>
export default {
  data() {
    return {
      totalValue: 0,
    };
  },
  props: {
    msg: {
      type: String,
      default: 'Add or Subtract',
    },
  },
  methods: {
    add() {
      const addValue = 1;
      this.totalValue += addValue;
    },
    subtract() {
      const subtractValue = 1;
      this.totalValue -= subtractValue;
    }
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
    <!-- <div class="buttons">
    <button @click="add">Add</button>
    <button @click="subtract">Subtract</button>
    
    </div> -->
    <h1 class="green">{{ msg }}</h1>
  </div>
</template>