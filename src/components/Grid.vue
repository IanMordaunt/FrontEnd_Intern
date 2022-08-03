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
    @cell-clicked="selectionChanged"
    @grid-ready="onGridReady"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, ref, onMounted, watch } from "vue";
// CSS
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

export default {
  name: "App",
  emits: ["selection-changed", "update-selection"],
  components: {
    AgGridVue,
  },
  setup(props, { emit }) {
    const gridApi = ref(null); // Optional - for accessing Grid's API

    // Obtain API from grid's onGridReady event
    const onGridReady = (params) => {
      gridApi.value = params.api;
      updateSelection();
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

    const deselectRows = () => {
      gridApi.value.deselectAll();
    };

    // Gets ids from the selected rows and pass them to parent component
    const selectionChanged = (event) => {
      const selectedNodes = gridApi.value.getSelectedNodes();
      const selectedRowIds = selectedNodes.map((item) => item.data.id);
      emit("selection-changed", selectedRowIds);
    };
    // Using props.selection from the parent component,
    // find the row id in the grid that matches the row id
    // in indexedDB that has the selected value = true,
    // then set that matching row in the grid to selected
    const updateSelection = () => {
      gridApi.value.forEachNode(function (node) {
        const foundItem = props.selection.find(
          (item) => item.id === node.data.id
        );
        node.setSelected(foundItem.selected);
      });
    };
    // WATCHER
    watch(
      () => props.selection,
      (newSelection) => {
        updateSelection();
        console.log("selection changed", newSelection);
      }
    );

    onMounted(() => {
      console.log("props", props.gridData);
      rowData.value = props.gridData;
      console.log(props.selection);
    });

    return {
      selection: [],
      //   Grid Data
      onGridReady,
      columnDefs,
      rowData,
      defaultColDef,
      selectionChanged,
      deselectRows,
    };
  },

  props: {
    gridData: {
      type: Array,
      required: true,
    },
    selection: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss">

</style>
