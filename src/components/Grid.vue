<template>
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
    @cell-clicked="cellWasClicked"
    @grid-ready="onGridReady"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, onMounted, ref } from "vue";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { saveSelections } from "../utilities/indexedDB-helper";

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

    // Load data from sever
    onMounted(() => {
      fetch("http://localhost:5555/data")
        .then((result) => result.json())
        .then((remoteRowData) => (rowData.value = remoteRowData));
    });

    return {
      // Version Change
      version: 0,
      changedLocation: "nowhere",
      selection: [],
      //   Grid Data
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef,
    };
  },

  methods: {
    async cellWasClicked(e) {
      // Example of consuming Grid Event
      const cellValue = e.value;
      this.selection.push(cellValue);
      await saveSelections(this.selection);
      this.updateVersion();

      console.log("cell was clicked", e.value);
    },

    deselectRows() {
      gridApi.value.deselectAll();
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
  },
  async mounted() {
    // await this.fetchData();

    // this.createSelectionObject();

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

<style lang="scss"></style>
