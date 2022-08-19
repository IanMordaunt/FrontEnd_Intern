<script>
import Plotly from "plotly.js-dist";
import { watch } from "vue";

export default {
  name: "App",
  emits: ["points-changed"],

  data() {
    return {
      pointSelection: [],
      pointIds: [],
      selectedPointsIds: [],
      selectedPoints: [],
    };
  },

  methods: {},

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

  setup(props) {
    watch(
      () => props.selection,
      (newSelection) => {
        console.log("selection changed PLOT", newSelection);
      }
    );
  },

  async mounted() {
    const TESTER = document.getElementById("graph");

    var color1 = "#7b3294";
    var color1Light = "#c2a5cf";

    // Array of X-key: values
    const xAxisData = this.gridData.map((item) => item.x).flat();

    // Array of Y-key: values
    const yAxisData = this.gridData.map((item) => item.y).flat();

    // Array of id-key: values
    const dataIds = this.gridData.map((item) => item.id).flat();

    Plotly.newPlot(
      TESTER,
      [
        {
          type: "scatter",
          x: xAxisData,
          y: yAxisData,
          ids: dataIds,
          mode: "markers",
          xaxis: "x",
          yaxis: "y",
          name: "random data",
          marker: { color: color1, size: 10 },
        },
      ],
      {
        title: "Scatter Plot (hold shift to make multiple selections)",
        clickmode: "event+select",
        xaxis: {
          zeroline: false,
        },
        yaxis: {},
      }
    );

    const pointsSelected = (selectedIds) => {
      this.$emit("points-changed", selectedIds);
      // console.log(selectedIds);
    };

    TESTER.on("plotly_selected", function (eventData) {
      var colors = [];
      for (var i = 0; i < xAxisData && yAxisData; i++) colors.push(color1Light);

      const selectedIds = eventData.points.map((point) => point.id);
      pointsSelected(selectedIds);

      eventData.points.forEach(function (pt) {
        colors[pt.pointNumber] = color1;
      });

      this.selectedPoints.points.forEach(function (pt) {
        colors[pt.pointNumber] = color1;
      })

      const updateData = () => {
        const selectedIds = this.selection.filter((item) => item.selected).map((item) => item.id);
        console.log("selected ids", selectedIds);

        let selectedDataIdx = [];

        this.gridData.forEach((item, index) => {
          if (selectedIds.includes(item.id)) {
            selectedDataIdx = [...selectedDataIdx, index];
            console.log("FINAL", selectedDataIdx);
            this.selectedPoints = selectedDataIdx;
          }
        });
      };
      
      Plotly.restyle(TESTER, "marker.color", [colors], [0]);
      updateData();
    });
   
    TESTER.on("plotly_deselect", function () {
      console.log("deselect");
    });
  },
};
</script>

<template>
  <div id="graph"></div>
</template>

<style scoped></style>
