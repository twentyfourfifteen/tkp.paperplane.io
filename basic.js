
//-----------------------
// some good old variables
var classesList = [];
var classParticipants = [];
var classGrades = [];
var classHealth = [];
var activeClass = "";
var studentAttendance = [];
var studentAttendanceAverage = [];
var attendanceTotals = [];
var sheets = {}

//---- clean up naming
function initialize(){
$.getJSON('sheetURLs.json', function(data) {
    sheets = data
    loadClasses()
});
}

//-----------------------
function changeName (name){
  activeClass = name
  name = classesList[name]
  document.getElementById("className").innerHTML = name.toUpperCase();
  document.getElementById("list").innerHTML = "";
  document.getElementById("student").innerHTML = "";
}


function preloader(status){
  if (status == "loading"){
    document.getElementById("preloader").style.visibility = 'visible';
    //document.getElementsByTagName("body").style.cursor= 'progress';
    document.getElementsByTagName("body")[0].style.cursor= 'progress';
    //console.log(status)
  } else if (status=="health") {
    document.getElementById('loadHealth').classList.remove('wait');
    document.getElementById("preloader").style.visibility = 'hidden';
    document.getElementsByTagName("body")[0].style.cursor= 'auto';
  } else if (status=="grades") {
    document.getElementById('loadGrades').classList.remove('wait');
    document.getElementById("preloader").style.visibility = 'hidden';
    document.getElementsByTagName("body")[0].style.cursor= 'auto';
  }
  else {
    document.getElementById("preloader").style.visibility = 'hidden';
    document.getElementsByTagName("body")[0].style.cursor= 'auto';
    //console.log(status)
  }
}


//------
function loadClasses(){
  console.log(localStorage.campus)
  //var sheets = sheetURLs()
  var newClasses = [];
    function classTable(data) {
      list = ""
      data.forEach(function(item, i) {
        newClasses[item.id] = item.name;
        list += "<a class='nav-item nav-link' onclick=loadClassList('" + item.id + "');>" + item.name +"</a>";
      });
      document.getElementById("class").innerHTML = list;
      preloader("loaded")
    }

    function errorFunc(e) {
      console.log(e);
    }
  if (classesList.length == 0){
    console.log("Loading classes")
    preloader("loading")
    //pull from Sheetsu campus class information based on campus chosen at index
    Sheetsu.read(sheets[localStorage.campus][0], {}).then(classTable, errorFunc);
    classesList = newClasses;
  } else {
    console.log("already did loadClasses")
    classTable(classesList);
  }
};


/*function preLoad(className){

  loadClassList(className);
  //loadClassGrades(className);
  //classOptions(className)
}*/

//----------
function loadClassList (className){
  changeName(className)
  var newParticipants = [];
  item = "<ul class='nav nav-tabs'><a class='nav-link navbar-brand active'>Loading</ul></a>";
  document.getElementById("classOptions").innerHTML = item;

  function studentTable(data) {
    //iterates through sheetsu data and stores it to a new array
    data.forEach(function(item, i) {
        newParticipants[i] = {};
        newParticipants[i]['StudentId'] = item.StudentId;
        newParticipants[i]['LastName'] = item.LastName;
        newParticipants[i]['FirstName'] = item.FirstName;
        newParticipants[i]['MiddleName'] = item.MiddleName;
        newParticipants[i]['Gender'] = item.Gender;
        newParticipants[i]['Parent1'] = item.Parent1;
        newParticipants[i]['Parent2'] = item.Parent2;
        newParticipants[i]['Phone'] = item.Phone;
        newParticipants[i]['Photo'] = item.Photo;
    });
    classParticipants[className] = newParticipants;
    preloader("loaded")
    classOptions(className)
    loadClassGrades(className)
    loadClassHealth(className)
  }

  function errorFunc(e) {
    console.log(e);
  }

  if (classParticipants[className] === undefined){
    console.log("Loading Roster")
    preloader("loading")
    Sheetsu.read(sheets[localStorage.campus][0], {sheet: className}).then(studentTable, errorFunc);

  } else {
    console.log('already did loadClassList')
    classOptions(className)
    loadClassGrades(className)
    loadClassHealth(className)
    //studentTable(classParticipants[className]);
  }
};


//------
function classOptions(className){
  var newOptions = [];
  document.getElementById("list").innerHTML = "";
  document.getElementById("student").innerHTML = "";
    item = "<ul class='nav nav-tabs'>"
    item += `<li class='nav-item'><a class='nav-link navbar-brand active'>${classesList[className]}</a></li>`;
    item += `<li class='nav-item' onclick=loadTableWithStudents('${className}');><a class='nav-link'>Students</a></li>`;
    item += `<li class='nav-item'><a id='loadGrades' class='nav-link wait' onclick=loadTableWithGrades('${className}');>Exam Grades</a></li>`;
    item += `<li class='nav-item'><a class='nav-link' onclick=loadGraph('${className}');>Attendance Chart</a></li>`;
    item += `<li class='nav-item'><a id='loadHealth' class='nav-link wait' onclick=loadTableWithHealth('${className}');>Health Records</a></li></ul>`;
  document.getElementById("classOptions").innerHTML = item;
  loadTableWithStudents(className)
};


//----------
function loadTableWithStudents (className){
  //changeName(className);
    data = classParticipants[className];
    row = "<table class='table table-hover' id='activeTable'><thead>"
    row += "<th><a onclick='sortTable(0)'>StudentID</a></th><th><a onclick='sortTable(1)'>Last Name</a></th><th><a onclick='sortTable(2)'>First</a></th><th><a onclick='sortTable(3)'> Middle</a></th>"
    row += "</thead><tbody id='listBody'>"
    document.getElementById("list").innerHTML = row
    data.forEach(function(item, i) {
      row = "<tr onclick=loadStudent('" + item.StudentId + "');>"
      row += "<td>" + item.StudentId + "</td><td>" + item.LastName + "</td><td>" +item.FirstName + "</td><td>" + item.MiddleName+ "</td></tr>";
      document.getElementById("listBody").insertAdjacentHTML('beforeend', row)
    });
    row = "</tbody></table>"
    document.getElementById("list").insertAdjacentHTML('beforeend', row)
};


//----------
function loadClassGrades (className){
  var newGrades = {};
  function studentTable(data) {
    data.forEach(function(item, i) {
        newGrades[item.StudentId] = {}
        newGrades[0] = {}
        for (var key in item) {
//          console.log(key, item[key]);
          newGrades[0][key] = key
          newGrades[item.StudentId][key] = item[key]
        }
        delete newGrades[item.StudentId].StudentId
        delete newGrades[0].StudentId
        //delete newGrades[item.StudentId].StudentId
    });
    preloader("grades")
  }

  function errorFunc(e) {
    console.log(e);
  }
  if (classGrades[className] === undefined){
    console.log("Loading Grades")
    preloader("loading")
    Sheetsu.read(sheets[localStorage.campus][2], {sheet: className}).then(studentTable, errorFunc);
    classGrades[className] = newGrades;
  } else {
    console.log('already did loadClassGrades')
    preloader("grades")
  }
};

//----------
function loadClassHealth (className){
  var newHealth = {};
  function studentTable(data) {
    data.forEach(function(item, i) {
        newHealth[item.StudentId] = {}
        newHealth[0] = {}
        for (var key in item) {
//          console.log(key, item[key]);
          newHealth[0][key] = key
          newHealth[item.StudentId][key] = item[key]
        }
        delete newHealth[item.StudentId].StudentId
        delete newHealth[0].StudentId
        //delete newGrades[item.StudentId].StudentId
    });
    classHealth[className] = newHealth;
    preloader("health")
  }

  function errorFunc(e) {
    console.log(e);
  }
  if (classHealth[className] === undefined){
    console.log("Loading Health")
    preloader("loading")
    //document.getElementById('loadHealth').classList.add('wait');
    Sheetsu.read(sheets[localStorage.campus][3], {sheet: className}).then(studentTable, errorFunc);
  } else {
    console.log('already did loadClassHealth')
    preloader("health")
  }
};

//----------
function loadTableWithGrades (className){
  changeName(className);
    data = classParticipants[className];
    data2 = classGrades[className];
    keys = data2[0]
    row = "<table class='table table-hover' id='activeTable'><thead><th><a onclick='sortTable(0)'>StudentID</a></th><th><a onclick='sortTable(1)'>Student Name</a></th>"
    var tr = 2
    for (var key in keys) {
    //          console.log(key, item[key]);
      row += `<th><a onclick='sortTable(${tr})'>${key}</a></th>`
      tr +=1
    }
    row += "</thead><tbody id='listBody'>"
    document.getElementById("list").innerHTML = row
    data.forEach(function(item, i) {
      row = "<tr onclick=loadStudent('" + item.StudentId + "');>"
      row += `<td>${item.StudentId}</td><td>${item.LastName}, ${item.FirstName}</td>`;
      for (var key in keys) {
      //          console.log(key, item[key]);
        row += `<td>${data2[item.StudentId][key]}</td>`
      }
      //row += "<td>" + item.StudentId + "</td><td>" + item.LastName + "</td><td>" +item.FirstName + " " + data2[item.StudentId]["Exam1"]+ "</td></tr>";
      row += "</tr>"
      document.getElementById("listBody").insertAdjacentHTML('beforeend', row)
    });
    row = "</tbody></table>"
    document.getElementById("list").insertAdjacentHTML('beforeend', row)

};


//----------
function loadTableWithHealth (className){
  changeName(className);
    data = classParticipants[className];
    data2 = classHealth[className];
    keys = data2[0]
    row = "<table class='table table-hover' id='activeTable'><thead><th><a onclick='sortTable(0)'>StudentID</a></th><th><a onclick='sortTable(1)'>Student Name</a></th>"
    var tr = 2
    for (var key in keys) {
    //          console.log(key, item[key]);
      row += `<th><a onclick='sortTable(${tr})'>${key}</a></th>`
      tr +=1
    }
    row += "</thead><tbody id='listBody'>"
    document.getElementById("list").innerHTML = row
    data.forEach(function(item, i) {
      row = "<tr onclick=loadStudent('" + item.StudentId + "');>"
      row += `<td>${item.StudentId}</td><td>${item.LastName}, ${item.FirstName}</td>`;
      for (var key in keys) {
      //          console.log(key, item[key]);
        row += `<td>${data2[item.StudentId][key]}</td>`
      }
      //row += "<td>" + item.StudentId + "</td><td>" + item.LastName + "</td><td>" +item.FirstName + " " + data2[item.StudentId]["Exam1"]+ "</td></tr>";
      row += "</tr>"
      document.getElementById("listBody").insertAdjacentHTML('beforeend', row)
    });
    row = "</tbody></table>"
    document.getElementById("list").insertAdjacentHTML('beforeend', row)
};

//----------
function loadGraph(className){
  //changeName(className);

  var one = 0
  var two = 0
  var three = 0

  function classTotals(data){
    const classes = data.find( student => student.Class === className );
    classes["Present"] = parseInt(classes["Present"])
    classes["Absent"] = parseInt(classes["Absent"])
    classes["Sick"] = parseInt(classes["Sick"])
    classes["Total"] = classes["Present"] + classes["Absent"] + classes["Sick"]
    one = Math.round(parseFloat(100*(classes["Present"]/classes["Total"])))
    two = Math.round(parseFloat(100*(classes["Absent"]/classes["Total"])))
    three = Math.round(parseFloat(100*(classes["Sick"]/classes["Total"])))
    studentAttendanceAverage[activeClass] = []
    studentAttendanceAverage[activeClass]["Present"] = one
    studentAttendanceAverage[activeClass]["Absent"] = two
    studentAttendanceAverage[activeClass]["Sick"] = three
    drawChart()
  }

  function errorFunc(e) {
    console.log(e);
  }

  if (studentAttendanceAverage[activeClass] === undefined){
      console.log("loading class totals")
      preloader("loading")
      Sheetsu.read(sheets[localStorage.campus][1], {sheet: "Totals"}).then(classTotals, errorFunc);
    } else {
      console.log("you have the class totals")
      one = studentAttendanceAverage[activeClass]["Present"]
      two = studentAttendanceAverage[activeClass]["Absent"]
      three = studentAttendanceAverage[activeClass]["Sick"]
      drawChart()
  }
  function drawChart(){
    preloader("loaded")
    document.getElementById("list").innerHTML = ""
    document.getElementById("student").innerHTML = ""
    chart = "<ul class='chart'>"
    chart += `<li class='chartli'><span class='chartspan' style='height:${one}%' title='Present'>Present: ${one}%</span></li>`
    chart += `<li class='chartli'><span class='chartspan' style='height:${two}%' title='Absent'>Absent: ${two}%</span></li>`
    chart += `<li class='chartli'><span class='chartspan' style='height:${three}%' title='Sick'>Sick: ${three}%</span></li>`
    chart += "</ul>"
    document.getElementById("list").innerHTML = chart
  }
};


//----------loadStudent
function loadStudent (StudentId){
  var newAttendance = [];
  list = classParticipants[activeClass]
  const item = list.find( student => student.StudentId === StudentId );
  document.getElementById("list").innerHTML = "";
  row = "<table class='table table-hover'><thead><th>StudentID</th><th>Name Last</th><th>First Middle</th></thead><tbody id='listBody'>"
  row += "<tr><td>" + item.StudentId + "</td><td>" + item.LastName + "</td><td>" +item.FirstName + " " + item.MiddleName+ "</td></tr></tbody></table>";
  document.getElementById("list").innerHTML = row

  // Personal information
  var img = "<div id='studentPhoto'><img src='/studentImages/student.jpg'></div>"

  table1 = "<div id='studentInformation'><table class='table'>"
  //table1 += `<th> ${dates[0]} - ${dates[dates.length - 1]}<th>`
  table1 += `<tr><td>Gender</td><td> ${item.Gender}</td></tr>`
  table1 += `<tr><td>Parent</td><td> ${item.Parent1}</td></tr>`
  table1 += `<tr><td>Parent</td><td> ${item.Parent2}</td></tr>`
  table1 += `<tr><td>Phone</td><td> ${item.Phone}</td></tr>`
  table1 += "</table></div>"
  img += table1
  document.getElementById("student").innerHTML = img;

  function displayStudent(data){
    //console.log(data)
    //document.getElementById("student").innerHTML = "";
    const item2 = data.find( student => student.StudentId === StudentId );
    // Attendance Table
    //delete item2["StudentId"]
    var dates = [];
    Object.keys(item2).forEach(function(key,index) {
        dates[index] = key// key: the name of the object key
    });
    table = "<table class='table'>"
    table += `<th> ${dates[1]} - ${dates[dates.length - 1]}<th>`

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
    document.getElementById("studentInformation").insertAdjacentHTML('beforeend', table)
    preloader("loaded")
  }

  function studentInformation(data) {
    data.forEach(function(item, i) {
      newAttendance[i] = item
    });
    studentAttendance[activeClass] = newAttendance;
    displayStudent(studentAttendance[activeClass]);
  }

  function errorFunc(e) {
    console.log(e);
  }

  if (studentAttendance[activeClass] === undefined){
      console.log("loading participant info")
      preloader("loading")
      Sheetsu.read(sheets[localStorage.campus][1], {sheet: activeClass}).then(studentInformation, errorFunc);
    } else {
      console.log("I think you have the participant info")
      displayStudent(studentAttendance[activeClass]);
  }
};
//------end of loadStudent



//------table sorter
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById('activeTable');
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
