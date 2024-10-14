const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "Free Backpack", link: "https://pinnaclehemp.com/checkout/?add-to-cart=115795&quantity=1", weight: 2 },
  { minDegree: 31, maxDegree: 90, value: "Free T-shirt", link: "https://pinnaclehemp.com/product/free-t-shirt/", weight: 2 },
  { minDegree: 91, maxDegree: 150, value: "THCA Starter Bundle", link: "https://pinnaclehemp.com/checkout/?add-to-cart=115796&quantity=1", weight: 1 },
  { minDegree: 151, maxDegree: 210, value: "10% Off Your Order", link: "https://pinnaclehemp.com?wdr_coupon=Free10off", weight: 8 },
  { minDegree: 211, maxDegree: 270, value: "Free Shipping", link: "https://pinnaclehemp.com/checkout/?wdr_coupon=spinfreeship", weight: 8 },
  { minDegree: 271, maxDegree: 330, value: "Roll-On Freeze", link: "https://pinnaclehemp.com/checkout/?add-to-cart=112163&quantity=1", weight: 1 },
  
];
//Size of each piece
const data = [16, 16, 16, 16, 16, 16];
//background color for each piece
var pieColors = [
  "#e03c31",
  "#ff7f41",
  "#f7ea48",
  "#2dc84d",
  "#147bd1",
  "#753bbd",
];
let myChart = new Chart(wheel, {
  // Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  // Chart Type Pie
  type: "pie",
  data: {
    // Labels (values which are to be displayed on the chart)
    labels: ["T-Shirt", "Backpack", "Roll-On\nFreeze", "Free\nShipping", "10% Off", "THCA\nStarter\nPack"],
    // Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors, // pieColors defined earlier
        data: data, // data defined earlier
      },
    ],
  },
  options: {
    // Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      // Hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      // Display labels inside the pie chart
      datalabels: {
        // Define the label color for each piece
        color: function(context) {
          let label = context.chart.data.labels[context.dataIndex];
          // Set "Roll-On Freeze" label to black, others to white
          return label === "Roll-On\nFreeze" ? "#000000" : "#ffffff";
        },
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 14, weight: 800 },
      },
    },
  },
});


//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Congratulations! You've Won: <br> <a href="${i.link}" target="_blank">${i.value}</a>`;  // Corrected line
      spinBtn.disabled = false;
      break;
    }
  }
};

// Function to generate weighted random degree
const getRandomWeightedDegree = () => {
  // Calculate the total weight
  let totalWeight = rotationValues.reduce((sum, item) => sum + item.weight, 0);

  // Get a random number between 0 and the total weight
  let randomWeight = Math.random() * totalWeight;

  // Find the corresponding degree based on the random weight
  let cumulativeWeight = 0;
  for (let item of rotationValues) {
    cumulativeWeight += item.weight;
    if (randomWeight <= cumulativeWeight) {
      // Return a random degree between the min and max of the selected item
      return Math.floor(Math.random() * (item.maxDegree - item.minDegree + 1)) + item.minDegree;
    }
  }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
// Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;

  // Generate weighted random degrees to stop at
  let randomDegree = getRandomWeightedDegree();

  //Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;

  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});