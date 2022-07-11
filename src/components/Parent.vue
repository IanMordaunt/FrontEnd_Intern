<script>
export default {
  data() {
    return {
      newUser: "",
      users: [],
    };
  },

  methods: {
    // Add a User
    addUser() {
      this.users = [...this.users, this.newUser]
      console.log('new user', this.users)

      localStorage.setItem("myContent", JSON.stringify({ users: this.users }));

    },


    // Get All Users
    getUsers() {
    const myContent = localStorage.getItem("myContent");
    const data = JSON.parse(myContent)
    this.users = data.users
    },
  },

  mounted() {

    this.getUsers()

    window.onstorage = () => {
      // When local storage changes, dump the list to
      // the console.
      this.getUsers()
      console.log(JSON.parse(window.localStorage.getItem('myContent')));
    };
  },
};
</script>

<template>
  <input
    v-model="newUser"
    @keyup.enter="addUser"
    placeholder="Add new user"
    filled
  />

  <button @click="addUser">Add User</button>

  <ul>
    <li v-for="(user, index) in users" :key="index">{{ user }}</li>
  </ul>
</template>
