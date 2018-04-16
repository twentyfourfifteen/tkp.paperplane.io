function selectSchool(selection){
    if (typeof(Storage) !== "undefined") {
      // Code for localStorage/sessionStorage.
      localStorage.campus = selection;
      window.location="classes.html"

    } else {
        // Sorry! No Web Storage support..
        alert("Sorry, this browser does not support the latest HTML5 tools.");
    }
    //console.log(localStorage.campus)
}
