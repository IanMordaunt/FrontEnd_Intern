<script>
import json from "../db.json";

export default {
  data() {
    return {
      myJson: {},
      version: 0,
      changedLocation: 'nowhere'
    };
  },

  methods: {

    updateVersion() {
      this.version += 1;
      this.changedLocation = "here"
      console.log("latest version:", this.version);

      console.log("new data", this.myJson);

      localStorage.setItem(
        "version",
        JSON.stringify({ version: this.version })
      );
    },

    getVersion(){
      const unparsedJson = localStorage.getItem("version");
      const data = JSON.parse(unparsedJson);
      console.log('get version', data)

      return data?.version
    }
  },

  mounted() {
    this.myJson = JSON.parse(JSON.stringify(json))
    if(this.getVersion() == null){
      this.updateVersion()
    }

    this.version = this.getVersion()

    window.onstorage = () => {
      console.log('VERSION CHANGED')
      this.changedLocation = "there"
      this.version = this.getVersion()

    //  get data from indexedDB because that changed
    };
  },
};
</script>

<template>


  <button @click="updateVersion()">Update Version</button>
  {{version}}

  <p>updated version: <strong>{{this.changedLocation}}</strong></p>
<!--  <div>-->
<!--    <ul>-->
<!--      <li v-for="(user, index) in users" :key="index">{{ user }}</li>-->
<!--    </ul>-->
<!--  </div>-->

<!--  <div>-->
<!--    &lt;!&ndash; Added on-change event for change in JSON. &ndash;&gt;-->
<!--    <div v-for="(data, index) in myJson" :key="index">-->
<!--      <p>{{ data }}</p>-->
<!--    </div>-->
<!--  </div>-->
</template>
