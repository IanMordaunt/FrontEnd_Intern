<script>
import json from "./jsonData.json";

export default {
  data() {
    return {
      newUser: "",
      users: [],
      myJson: json,
    };
  },

  methods: {
    // Add a User
    addUser() {
      this.users = [...this.users, this.newUser];
      console.log("new user", this.users);

      localStorage.setItem("myContent", JSON.stringify({ users: this.users }));
    },
    // Add all JSON Data to Local Storage
    addData() {
      console.log("new data", this.myJson);

      localStorage.setItem("myData", JSON.stringify({ myJson: this.myJson }));
    },

    // Get All Users
    getUsers() {
      const myContent = localStorage.getItem("myContent");
      const data = JSON.parse(myContent);
      this.users = data.users;
    },

    getData() {
      const myData = localStorage.getItem("myData");
      const data = JSON.parse(myData);
      this.myJson = data.myJson;
    }
  },

  mounted() {
    // this.getUsers();
    // this.getData();

    window.onstorage = () => {
      // When local storage changes, dump the list to
      // the console.
      this.getUsers();
      this.getData();
      console.log(JSON.parse(window.localStorage.getItem("myContent")));
      console.log(JSON.parse(window.localStorage.getItem("myData")));
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
  <button @click="addData">Add Data</button>
  <div>
    <ul>
      <li v-for="(user, index) in users" :key="index">{{ user }}</li>
    </ul>
  </div>

  <div>
    <div v-for="(data, index) in myJson" :key="index"><p>{{ data.name }}</p></div>

  </div>
</template>
