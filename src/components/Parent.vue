<script>
import axios from "axios"

export default {
  data() {
    return {

      myJson: {},
      selection: [],
      version: 0,
      changedLocation: 'nowhere'

     
      myJson: json,
      version: 0,
      

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
    },

    async fetchData(){
      try{
        const res = await axios.get('http://localhost:5555/data')
        console.log('response', res.data)
        this.myJson = res.data
      } catch (e) {
        console.log('error', e)
      }
    },

    createSelectionObject(){
      this.selection = this.myJson.map((item) => {
        return {id: item.id, selected: false}
      })
    },

    toggleItemSelection(id){
      const foundItem = this.selection.find((item) => item.id === id)
      foundItem.selected = !foundItem.selected
    },

    isActive(id){
      const foundItem = this.selection.find((item) => item.id === id)
      return foundItem.selected
    }
  },

  async mounted() {
    await this.fetchData()

    this.createSelectionObject()


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
  <div>
    <ul>
      <li v-for="(item, index) in myJson" :key="index">{{item.id}} - {{ item.text }}</li>
    </ul>
  </div>

  <div>
    <ul>
      <li v-for="(item, index) in selection" :key="index">
        <button class="" type="button" @click="toggleItemSelection(item.id)" :class="{active: isActive(item.id) }">{{item.id}}</button>
      </li>
    </ul>
  </div>

</template>

<style>

.active{
  background-color:red;
}

</style>
