console.log("Running the Javascript");
// Check if the user's display name is stored in local storage
// if yes redirect to index page directly
if (localStorage.getItem("displayname") != null) {
    console.log("in that if condition");
    window.location.replace("/");
}

// Add the signin method to the signin button to add displayname to
// local storage
document.getElementById("signin").addEventListener("submit", signin);
function signin() {
    var displayName = document.getElementsByName("displayname")[0].value;
    localStorage.setItem("displayname", displayName);
}
