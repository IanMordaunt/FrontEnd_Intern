<script>
import axios from "axios";
import Grid from "./Grid.vue";
import { saveSelections, getSelections } from "../utilities/indexedDB-helper";

export default {
  components: {Grid},
  data() {
    return {
      myJson: {},
      selection: [],
      version: 0,
      changedLocation: "nowhere",
    };
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
      console.log("get version", data);

      return data?.version;
    },

    async fetchData() {
      try {
        const res = await axios.get("http://localhost:5555/data");
        console.log("response", res.data);
        this.myJson = res.data;
      } catch (e) {
        console.log("error", e);
      }
    },

    createSelectionObject() {
      this.selection = this.myJson.map((item) => {
        console.log({ id: item.id });
        return { id: item.id, selected: false };
      });
    },

    async toggleItemSelection(id) {
      const foundItem = this.selection.find((item) => item.id === id);
      foundItem.selected = !foundItem.selected;
      await saveSelections(this.selection);
      this.updateVersion();
    },

    isActive(id) {
      const foundItem = this.selection.find((item) => item.id === id);
      return foundItem.selected;
    },
  },

  async mounted() {
    await this.fetchData();

    this.createSelectionObject();

    if (this.getVersion() == null) {
      this.updateVersion();
    }

    this.version = this.getVersion();

    const updateSelection = async () => {
      try {
        const newSelection = await getSelections();
        this.selection = newSelection.selectionList;
      } catch (e) {
        console.log("ERROR", e);
      }
    };

    updateSelection()

    window.onstorage = async () => {
      console.log("VERSION CHANGED");
      this.changedLocation = "there";
      this.version = this.getVersion();
      updateSelection()
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
      <Grid />
    </div>

  </div>
</template>

<style>
.active {
  background-color: red;
}

.parent-wrapper{
  display: flex;
}

.right-side{
  flex:1
}
</style>
