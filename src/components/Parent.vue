<script>
import axios from "axios";
import Grid from "./Grid.vue";
import { saveSelections, getSelections } from "../utilities/indexedDB-helper";
export default {
  components: { Grid },
  data() {
    return {
      loaded: false,
      myJson: [],
      selection: [],
      version: 0,
      changedLocation: "nowhere",
    };
  },

  props: {
    gridSelection: {
      type: Array,
      reuqired: true,
    },
  },

  methods: {
    openIt() {
      const url = "new_url";
      window.open(url);
    },

    updateVersion() {
      this.version += 1;
      this.changedLocation = "here";
      console.log("latest version:", this.version);

      localStorage.setItem(
        "version",
        JSON.stringify({ version: this.version })
      );
    },

    getVersion() {
      const unparsedJson = localStorage.getItem("version");
      const data = JSON.parse(unparsedJson);
      return data?.version;
    },

    async fetchData() {
      try {
        const res = await axios.get("http://localhost:5555/data");
        this.myJson = res.data;
      } catch (e) {
        console.log("error", e);
      }
    },

    fetchColumns() {},

    createSelectionObject() {
      this.selection = this.myJson.map((item) => {
        console.log({ id: item.id });
        return { id: item.id, selected: false };
      });
    },

    async gridSelectionChanged(selectedRowIds) {

      this.selection.forEach((item) => {
        item.selected = selectedRowIds.includes(item.id)
        
      })

      console.log('grid selection changed', this.selection)

      await saveSelections(this.selection);

      this.updateVersion();
    },

    updateSelectionDB(id) {
      const currentSelection = this.selection.map((item) => item.id === id);
      // console.log(currentSelection)
      // console.log(this.selection)
    },

    isActive(id) {
      const foundItem = this.selection.find((item) => item.id === id);
      return foundItem.selected;
    },
  },

  // step 1 - mount component
  async mounted() {
    // step 2 - get data from backend
    await this.fetchData();

    // step 3 - if no version exists then update it
    if (this.getVersion() == null) {
      this.updateVersion();
    }

    this.version = this.getVersion();

    //  step 4 - does selection object exist in IndexDB?
    const updateSelection = async () => {
      try {
        const newSelection = await getSelections();
        // 4a - NO - create selection
        if (!newSelection?.selectionList.length) {
          this.createSelectionObject();
        } else {
          // 4b - 
          this.selection = newSelection.selectionList;
        }
      } catch (e) {
        console.log("ERROR", e);
      }
    };

    await updateSelection();

    this.loaded = true;

    window.onstorage = async () => {
      console.log("VERSION CHANGED");
      this.changedLocation = "there";
      this.version = this.getVersion();
      updateSelection();
      console.log(this.selectionUpdate);
    };
  },
};
</script>

<template>
  <div class="parent-wrapper">
    <div class="left-side">
      <div>
        <button @click="openIt()">New Window</button>
      </div>
      <p>
        updated version: <strong>{{ this.changedLocation }}</strong>
      </p>
      <div>
        <ul>
          <li v-for="(item, index) in myJson" :key="index">
            {{ item.id }} - {{ item.text }}
          </li>
        </ul>
      </div>
    </div>

    <div class="right-side">
      <Grid
        v-if="loaded"
        :gridData="myJson"
        :selection="selection"
        @update-selection="updateSelectionDB"
        @selection-changed="gridSelectionChanged"
      />
    </div>
  </div>
</template>

<style>
.active {
  background-color: red;
}

.parent-wrapper {
  display: flex;
}

.right-side {
  flex: 1;
}
</style>
