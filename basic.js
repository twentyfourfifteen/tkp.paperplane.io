var classesList = [];
var classParticipants = [];
var activeClass = "";
var studentAttendance = [];

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });

  return result;
};


//------
function loadClasses(){
  console.log("started")
  var newClasses = [];
    function classTable(data) {
      data.forEach(function(item, i) {
        newClasses[item.id] = item.name;
        item = "<li onclick=loadTable('" + item.id + "');><a href='#'>" + item.name +"</a></li>";
        document.getElementById("class").innerHTML += item;
      });
      console.log("finished")
    }

    function errorFunc(e) {
      console.log(e);
    }
  if (classesList.length == 0){
    console.log("Loading classes")
    Sheetsu.read("https://sheetsu.com/apis/v1.0su/0621583e95d7", {}).then(classTable, errorFunc);
    classesList = newClasses;
  } else {
    classTable(classesList);
  }
};

//----------
function loadTable (sheetId){
  changeName(sheetId);
  var newParticipants = [];
  function studentTable(data) {
    data.forEach(function(item, i) {
        newParticipants[i] = {};
        newParticipants[i]['StudentId'] = item.StudentId;
        newParticipants[i]['LastName'] = item.LastName;
        newParticipants[i]['FirstName'] = item.FirstName;
        newParticipants[i]['MiddleName'] = item.MiddleName;
      row = "<tr onclick=loadStudent('" + item.StudentId + "');>"
      row += "<td>" + item.StudentId + "</td><td>" + item.LastName + "</td><td>" +item.FirstName + " " + item.MiddleName+ "</td></tr>";
      document.getElementById("list").innerHTML += row
    });
  }

  function errorFunc(e) {
    console.log(e);
  }

  //console.log(sheetId) /class8red
  if (classParticipants[sheetId] === undefined){
    console.log("Loading Roster")
    Sheetsu.read("https://sheetsu.com/apis/v1.0su/0621583e95d7", {sheet: sheetId}).then(studentTable, errorFunc);
    classParticipants[sheetId] = newParticipants;
  } else {

    studentTable(classParticipants[sheetId]);
  }
};

//--------
function changeName (name){
  activeClass = name
  name = classesList[name]
  document.getElementById("className").innerHTML = name.toUpperCase();
  document.getElementById("list").innerHTML = "";
  document.getElementById("student").innerHTML = "";
  //drawChart()
}

//----------
function loadStudent (StudentId){
  var newAttendance = [];
  list = classParticipants[activeClass]
  const item = list.find( student => student.StudentId === StudentId );

  document.getElementById("list").innerHTML = "";
  row = "<tr><td>" + item.StudentId + "</td><td>" + item.LastName + "</td><td>" +item.FirstName + " " + item.MiddleName+ "</td></tr>";
  document.getElementById("list").innerHTML += row

  function studentInformation(data) {
    data.forEach(function(item, i) {
      newAttendance[i] = item
    });
    studentAttendance[activeClass] = newAttendance;
    console.log(studentAttendance)
    displayAttendance(studentAttendance[activeClass]);
  }

  function errorFunc(e) {
    console.log(e);
  }

  function displayAttendance(data){
    document.getElementById("student").innerHTML = "";
    const item2 = data.find( student => student.StudentId === StudentId );
    delete item2["StudentId"]
    var dates = [];
    Object.keys(item2).forEach(function(key,index) {
        dates[index] = key// key: the name of the object key
    });
    table = "<table class='table'>"

    table += `<th> ${dates[0]} - ${dates[dates.length - 1]}<th>`

    var attendance = [];
      attendance["p"] = 0
      attendance["a"] = 0
      attendance["s"] = 0
    Object.keys(item2).forEach(function(key,index) {
        var status = item2[key].toLowerCase()
        attendance[status]+=1
    });
    table += `<tr><td>Present</td><td> ${attendance['p']}</td></tr>`
    table += `<tr><td>Absent</td><td> ${attendance['a']}</td></tr>`
    table += `<tr><td>Sick</td><td> ${attendance['s']}</td></tr>`
    table += "</table>"
    document.getElementById("student").innerHTML = table;

  }


  if (studentAttendance[activeClass] === undefined){
    console.log("loading participant info")
    Sheetsu.read("https://sheetsu.com/apis/v1.0su/c182da104d40", {sheet: activeClass}).then(studentInformation, errorFunc);
  } else {
    console.log("I think you have the participant info")
    displayAttendance(studentAttendance[activeClass]);
  }
};


/*function drawChart(){
  var labels = [];
  var data = [];
  var names = [];
    function successFunc(data) {
      console.log(data)
      const present = data.find( student => student["Class"] === activeClass );
      console.log(present)

        names = present["Class"]
        delete present["Class"]
        Object.keys(present).forEach(function(key,index) {
          labels.push(key.slice(0,-5))
          data.push(present[key])
        });
      };

      var ctx = document.getElementById("myChart").getContext('2d');
      var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [{
                label: names,
                backgroundColor: ['rgba(71, 78, 93, 0.3)'],
                //borderColor: window.chartColors.blue,
                data: data,
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
      Sheetsu.read("https://sheetsu.com/apis/v1.0su/c182da104d40", {}).then(successFunc);
    }
*/
