<script>
import axios from "axios";
import Grid from "./Grid.vue";
import {
  saveSelections,
  getSelections,
  saveData,
  getData,
} from "../utilities/indexedDB-helper";

const SPREADSHEET_URL = "spreadsheet_only";

const isSecondaryWindow = () => {
  const url = new URLSearchParams(location.search);
  const urlName = url.get("name");
  console.log("url name", urlName);
  return urlName === SPREADSHEET_URL;
};

export default {
  components: { Grid },

  data() {
    return {
      loaded: false,
      gridData: [],
      selection: [],
      version: 0,
      changedLocation: "nowhere",
      gridColumns: [],
      showgrid: true,
    };
  },

  // props: {
  //   gridColumn: {
  //     type: Array,
  //     required: true,
  //   },
  // },

  methods: {
    openSecondaryWindow() {
      const url = `?name=${SPREADSHEET_URL}`;
      window.open(url, "_black", "toolbar=0, location=0, menubar=0");
      // this.showgrid = false;
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
        this.gridData = res.data;
      } catch (e) {
        console.log("error", e);
      }
    },

    fetchColumns() {
      const keysArray = this.gridData.map((item) => Object.keys(item)).flat();
      const uniqueKeys = [...new Set(keysArray)];
      this.gridColumns = uniqueKeys.map((item) => {
        return {field: item}
      });
      console.log(this.gridColumns);
    
    },

    createSelectionObject() {
      this.selection = this.gridData.map((item) => {
        // console.log({ id: item.id });
        return { id: item.id, selected: false };
      });
    },

    async gridSelectionChanged(selectedRowIds) {
      this.selection.forEach((item) => {
        item.selected = selectedRowIds.includes(item.id);
      });
      await saveSelections(this.selection);
      this.updateVersion();
    },

    isActive(id) {
      const foundItem = this.selection.find((item) => item.id === id);
      return foundItem.selected;
    },
  },

  // step 1 - mount component
  async mounted() {
    // step 2 - get data
    if (isSecondaryWindow()) {
      // fetch data from indexedDB
      const indexedDBData = await getData();
      this.gridData = indexedDBData.dataList;
    } else {
      // this is Primary Window - fetch data from database
      await this.fetchData();
      this.fetchColumns();

      // save gridData into IndexedDB
      saveData(this.gridData);
    }

    // step 3 - if no version exists then update it
    if (this.getVersion() == null) {
      this.updateVersion();
    }

    this.version = this.getVersion();

    //  step 4 - does selection object exist in IndexedDB?
    const updateSelection = async () => {
      try {
        const newSelection = await getSelections();
        // 4a - NO - create selection
        if (!newSelection?.selectionList.length) {
          this.createSelectionObject();
        } else {
          // 4b - YES - update local variable in IndexedDB
          this.selection = newSelection.selectionList;
        }
      } catch (e) {
        console.log("ERROR", e);
      }
    };

    await updateSelection();
    // this mounts the Grid.vue component with v-if
    this.loaded = true;

    //check url

    window.onstorage = async () => {
      this.changedLocation = "there";
      this.version = this.getVersion();
      updateSelection();
    };
  },
};
</script>

<template>
  <div class="parent-wrapper">
    <div class="left-side">
      <p>
        updated version: <strong>{{ this.changedLocation }}</strong>
      </p>
      <div>
        <ul>
          <li v-for="(item, index) in gridData" :key="index">
            {{ item.id }} - {{ item.text }}
          </li>
        </ul>
      </div>
    </div>

    <div class="right-side" id="right-side">
      <div v-show="loaded && showgrid">
        <button id="newWindowBtn" @click="openSecondaryWindow()">
          <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" />
        </button>

        <Grid
          v-if="loaded"
          :gridColumns="gridColumns"
          :gridData="gridData"
          :selection="selection"
          @selection-changed="gridSelectionChanged"
        />
      </div>
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
  display: "block";
}

.newWindowBtn {
  margin-bottom: 0;
}
</style>
