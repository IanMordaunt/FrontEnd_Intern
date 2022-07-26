<template>
  <div>
    <button @click="openIt()">New Window</button>
  </div>
  <p>
    updated version: <strong>{{ this.changedLocation }}</strong>
  </p>

  <button @click="deselectRows">deselect rows</button>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 500px"
    :columnDefs="columnDefs.value"
    :rowData="rowData.value" 
    :defaultColDef="defaultColDef"
    rowSelection="multiple"
    animateRows="true"
    @cell-clicked="toggleItemSelection()"
    @grid-ready="onGridReady"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, ref } from "vue";
import axios from "axios";
// CSS
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
// IndexedDB-helper
import { saveSelections, getSelections } from "../utilities/indexedDB-helper";

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  setup() {
    const gridApi = ref(null); // Optional - for accessing Grid's API

    // Obtain API from grid's onGridReady event
    const onGridReady = (params) => {
      gridApi.value = params.api;
    };

    const rowData = reactive({}); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
    const columnDefs = reactive({
      value: [{ field: "id" }, { field: "title" }, { field: "text" }],
    });

    // DefaultColDef sets props common to all Columns
    const defaultColDef = {
      sortable: true,
      filter: true,
      flex: 1,
    };

    return {
      // Version Change
      version: 0,
      changedLocation: "nowhere",
      //   IndexedDB Data
      selection: [],
      myJson: {},
      //   Grid Data
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef,
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
        const res = await fetch("http://localhost:5555/data")
          .then((result) => result.json())
          .then((remoteRowData) => (this.rowData.value = remoteRowData));
        this.myJson = res;
        console.log("response", res);
      } catch (e) {
        console.log("ERROR", e);
      }
      console.log("myJson", this.myJson);
    },

    // async cellWasClicked(e) {
    //   let cellValue = e.value;
    //   this.selection.push(cellValue);
    //   await saveSelections(this.selection);
    //   this.updateVersion();
    //   console.log("cell value - ", e.value);

    //   this.toggleItemSelection();
    // },

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

    deselectRows() {
      gridApi.value.deselectAll();
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

    updateSelection();

    window.onstorage = async () => {
      console.log("VERSION CHANGED");
      this.changedLocation = "there";
      this.version = this.getVersion();
      updateSelection();
    };
  },
};
</script>

<style lang="scss">
.active {
  background-color: red;
}
</style>
