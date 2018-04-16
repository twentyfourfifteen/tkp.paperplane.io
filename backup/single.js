<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.js"></script>
  <script src="//script.sheetsu.com/"></script>
</head>
<body>

  <script>
    Sheetsu.read("https://sheetsu.com/apis/v1.0su/c182da104d40", {}).then(successFunc);

    function successFunc(data) {
      //console.log(data)
      present = data
      var labels = [];
      //labels["class"] = [];
      var data = [];
      var names = [];

      present.forEach(function(item, i) {
        labels[i] = [];
        data[i] = [];
        names[i] = present[i]["Class"]
        delete present[i]["Class"]
        Object.keys(present[i]).forEach(function(key,index) {
          labels[i].push(key.slice(0,-5))
          data[i].push(present[i][key])
        });
      });
      //const present = data.find( student => student.StudentId === "P" );

      var ctx = document.getElementById("myChart").getContext('2d');
      var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels[0],
              datasets: [{
                label: names[0],
                backgroundColor: ['rgba(0, 255, 0, 0.3)'],
                //borderColor: window.chartColors.blue,
                data: data[0],
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:false
                      }
                  }]
              }
          }
      });

    }
  </script>
  <canvas id="myChart" width="400" height="200"></canvas>

</body>
