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
      let newUser = {
        id: Date.now(),
        name: this.newUser,
      };
      this.users.push(newUser);
      this.newUser = "";

      db.collection("users").add(newUser);

      //TODO: Setup version change ********************

      this.getUsers();

      request.onupgradeneeded = function (e) {
        let db = e.target.result,
          const objectStore = db.createObjectStore("userStore", { keyPath: "uID" });
      };

      request.onsuccess = function (e) {
        db = request.result;

        this.users.push(db.users);
      };
      //TODO: Setup version change *********************

    },

    // Update a User
    updateUser() {
      db.collection("users").doc({ id: 1 }).update({
        name: "Jet",
      });
    },

    // Overwrite a User
    overwriteUser() {
      db.collection("users")
        .doc({ id: 1 })
        .set({ id: 4, name: "Gill", age: 18 });
    },

    // Get All Users
    getUsers() {
      db.collection("users")
        .get()
        .then((users) => {
          this.users = users;
          // console.log(users)
        });
    },
  },

  watch: {},

  mounted() {},
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
  <button @click="updateUser">Update User</button>
  <button @click="overwriteUser">Overwite User</button>
  <button @click="getUsers">Get All User</button>

  <ul>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
