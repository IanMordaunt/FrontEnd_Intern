<script>
import Plotly from "plotly.js-dist";

export default {
  name: "App",
  emits: ["points-changed"],

  data() {
    return {
      pointSelection: [],
      pointIds: [],
      selectedPointsIds: [],
    };
  },

  methods: {},

  props: {
    gridData: {
      type: Array,
      required: true,
    },
  },

  setup(props, { emit }) {

    const plotSelection = (event) => {
      const pointsArray = this.pointSelection;
      const selectedPointsIds = pointsArray.map((item) => item.id);
      console.log(selectedPointsIds);
      emit("points-changed", selectedPointsIds);
    };
  },

  async mounted() {
    const TESTER = document.getElementById("graph");

    var color1 = "#7b3294";
    var color1Light = "#c2a5cf";
    var colorX = "#ffa7b5";
    var colorY = "#fdae61";

// Array of X-key: values
    const xAxisData = this.gridData.map((item) => item.x).flat();
    console.log("DATA-X:VALUES", xAxisData);

// Array of Y-key: values
    const yAxisData = this.gridData.map((item) => item.y).flat();
    console.log("DATA-Y:VALUES", yAxisData);

// Array of id-key: values
    const dataIds = this.gridData.map((item) => item.id).flat();
    const idsArray = dataIds.toString().split(",")

    // this.selectedPointsIds = dataIds;
    console.log("DATA-ID:VALUES", dataIds);
    console.log(idsArray)

    var ids = idsArray;
    var x = xAxisData;
    var y = yAxisData;

    Plotly.newPlot(
      TESTER,
      [
        {
          type: "scatter",
          mode: "markers",
          x: x, 
          y: y,
          ids: ids,
          xaxis: "x", 
          yaxis: "y",
          name: "random data",
          marker: { color: color1, size: 10 },
        },
        {
          type: "histogram",
          x: x,
          xaxis: "x2",
          yaxis: "y2",
          name: "x coord dist.",
          marker: { color: colorX },
        },
        {
          type: "histogram",
          x: y,
          xaxis: "x3",
          yaxis: "y3",
          name: "y coord dist.",
          marker: { color: colorY },
        },
      ],
      {
        title: "Scatter Plot (hold shift to make multiple selections)",
        clickmode: "event+select",
        xaxis: {
          zeroline: false,
        },
        yaxis: {
          domain: [0.55, 1],
        },
        xaxis2: {
          domain: [0, 0.45],
          anchor: "y2",
        },
        yaxis2: {
          domain: [0, 0.45],
          anchor: "x2",
        },
        xaxis3: {
          domain: [0.55, 1],
          anchor: "y3",
        },
        yaxis3: {
          domain: [0, 0.45],
          anchor: "x3",
        },
      }
    );

    TESTER.on("plotly_selected", function (eventData) {

      const pointAxis = [];
      var ids = [];
      var x = [];
      var y = [];
      this.pointSelection = [pointAxis];

      console.log(this.pointSelection);
      console.log(this.selectedPointsIds);

      var colors = [];
      for (var i = 0; i < xAxisData && yAxisData; i++) colors.push(color1Light);
      //   for (var i = 0; i < yAxisData; i++) colors.push(color1Light);

      eventData.points.forEach(function (pt) {
        pointAxis.push([pt.ids, pt.x, pt.y]);
        ids.push(pt.ids)
        x.push(pt.x);
        y.push(pt.y);
        
        colors[pt.pointNumber] = color1;
      });

      Plotly.restyle(
        TESTER,
        {
          x: [x, y],
          xbins: {},
        },
        [1, 2]
      );

      Plotly.restyle(TESTER, "marker.color", [colors], [0]);
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
