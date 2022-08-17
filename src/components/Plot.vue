<script>
import Chart from "chart.js/auto";

export default {
  name: "App",

  mounted() {
    console.log("Compoent Mounted");

    const ctx = document.getElementById("myChart");
    const myChart = new Chart(ctx, {
      type: "scatter",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "Hydrogen Density",
            data: [
              { x: 12, y: 20 },
              { x: 15, y: 10 },
              { x: 13, y: 15 },
              { x: 14, y: 17 },
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
          },
        },
      },
    });

    function clickHandler(click) {
      console.log(click);
      const points = myChart.getElementsAtEventForMode(
        click,
        "nearest",
        { intersect: true },
        true
      );
      if (points[0]) {
        const dataset = points[0].datasetIndex;
        const index = points[0].index;
        const value = myChart.data.datasets[dataset].data[index];
        console.log(myChart.data.datasets[dataset].data[index]);
      }
    }

    myChart.canvas.onclick = clickHandler;
  },
};
</script>

<template>
  <canvas id="myChart" width="400" height="400"></canvas>
</template>

<style scoped></style>
