<script>
import json from "../db.json";

export default {
  data() {
    return {
     
      myJson: json,
      version: 0,
      
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
      this.version += 1;
      console.log("latest version:", this.version);

      console.log("new data", this.myJson);

      localStorage.setItem(
        "myData",
        JSON.stringify({ version: this.version, myJson: this.myJson })
      );
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
    },
  },
  watch: {
    myJson(curretVersion, updatedVersion) {
      if (curretVersion.indexOf('data') > -1) {
        this.addData();
      }
    },
  },

  mounted() {
    // this.getUsers();
    this.myJson;
    this.getData();

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
    <!-- Added on-change event for change in JSON. -->
    <div v-for="(data, index) in myJson" :key="index">
      <p>{{ data }}</p>
    </div>
  </div>
</template>
