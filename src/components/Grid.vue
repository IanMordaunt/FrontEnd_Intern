

<template>
  <button @click="deselectRows">deselect rows</button>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 500px"
    :columnDefs="columnDefs.value"
    :rowData="rowData.value" 
    :defaultColDef="defaultColDef"
    rowSelection="multiple"
    animateRows="true"
    @cell-clicked="toggleItemSelection"
    @grid-ready="onGridReady"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, ref, onMounted } from "vue";
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
  setup(props) {
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

    onMounted(() => {
      console.log('props', props.gridData)
      rowData.value = props.gridData
    });

    return {
      selection: [],
      //   Grid Data
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef,
    };
  },

  props: {
    gridData: {
      type: Array,
      required: true
    }
  },

  methods: {

    async toggleItemSelection(event) {
        console.log('event', event)
        const id = event.data.id
        this.$emit('selection-changed', id)
      // const foundItem = this.selection.find((item) => item.id === id);
      // foundItem.selected = !foundItem.selected;
      // await saveSelections(this.selection);
      // this.updateVersion();
    },

    deselectRows() {
      gridApi.value.deselectAll();
    },
  },
  mounted() {
    // console.log('grid api', gridApi)
  }
};
</script>

<style lang="scss">
.active {
  background-color: red;
}
</style>
