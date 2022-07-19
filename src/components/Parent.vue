<script>
import axios from "axios";
// import indexedDB from "../utilities/indexedDB-helper";


// Create IndexedDB - Set DB-Name and DB-Version
const DB_NAME = 'stateManager'
const DB_VERSION = 2
const TABLE_NAME = 'selections'
let DB


const getDb = async () => new Promise((resolve, reject) => {
  console.log('call get DB')
  if (DB) {
    console.log('exists')
    resolve(DB)
  }

  const request = indexedDB.open(DB_NAME, DB_VERSION)
  console.log("REQUEST", request)

  request.onerror = (event) => {
    console.log('DB ERROR', event)
    reject(`Error ${event}`)
  }

  request.onsuccess = (event) => {
    console.log('DB SUCCESS', event.target.result)
    DB = event.target.result
    resolve(DB)
  }

  request.onupgradeneeded = (event) => {
    console.log('DB ON UPDATE NEEDED')
    const db = (event.target).result
    try {
      db.deleteObjectStore(TABLE_NAME)
    } catch {

    }
    db.createObjectStore(TABLE_NAME, { keyPath: 'selectionId' })
  }
});

const saveSelections = async (newSelections) => {
const db = await getDb()
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
 
     const note = {
        selectionId: 4,
        selectionList: JSON.parse(JSON.stringify(newSelections))
      } 

      const trans = db.transaction(TABLE_NAME, 'readwrite')
      const store = trans.objectStore(TABLE_NAME)

      /* Remove observable data added by VUE
    https://github.com/vuejs/Discussion/issues/292 */
      // const cleanedUpData = JSON.parse(JSON.stringify(newSelections))

    
      console.log('ADD TO INDEXEDDB', note)
      const result = await store.put(note)


      // close database when transaction is complete
      trans.oncomplete = () => {
        db.close()
      }

      resolve(result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`There was an error adding to drafts, ${error}`)
      reject(error)
    }
  })
};

const getSelections = async (selectionId) => {
  const db = await getDb()
  let selections = {} 

  return new Promise((resolve, reject) => {
    try {
      const trans = db.transaction(TABLE_NAME, 'readonly')
      const store = trans.objectStore(TABLE_NAME)
      const request = store.get(9)


      // assign results to selections when request has been successful
      request.onsuccess = (event) => {
        selections = event.target.result ?? selections
        resolve(selections)
      }

      // close db when request is complete
      request.oncomplete = () => {
        db.close()
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`There was an error accessing drafts, ${error}`)
      reject(error)
    }
  })
};



export default {
  data() {
    return {

      myJson: {},
      selection: [],
      version: 0,
      changedLocation: 'nowhere',
      
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

    getVersion() {
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
        console.log({id: item.id})
        return {id: item.id, selected: false}
        
      })
    },

    toggleItemSelection(id){
      const foundItem = this.selection.find(item => item.id === id)
      foundItem.selected = !foundItem.selected
      // saveSelections()
    },

    isActive(id){
      const foundItem = this.selection.find(item => item.id === id)
      return foundItem.selected
    }
  },

  

  async mounted() {



    await this.fetchData()

    this.createSelectionObject()
    // this.toggleItemSelection()
    // this.isActive()
   

    if(this.getVersion() == null){
      this.updateVersion()
    }

    this.version = this.getVersion()

    window.onstorage = async () => {
      console.log('VERSION CHANGED')
      this.changedLocation = "there"
      this.version = this.getVersion()

    //  get data from indexedDB because that changed
    const newSelection =  await getSelections()
    this.selection = newSelection.selectionList

//  saveSelections()
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
