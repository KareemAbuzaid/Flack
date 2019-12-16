// Get references to the dom elements
var scroller = document.querySelector("#scroller");
var newChannelTemplate = document.querySelector('#new_channel_template');
var sentinel = document.querySelector('#sentinel');
var channelTemplate = document.querySelector('#channel_template');

// set a counter to count the items loaded
var counter = 0;


// Add event listner to the create channel button
document.getElementById("add-channel").addEventListener("click", addChannel);
function addChannel() {
    // Make the create new channel template visable
    newChannelTemplate.style.visibility='visible';
    newChannelTemplate.querySelector("#create-btn").addEventListener("click", createChannel);
    function createChannel (templateClone) {
        let channelTemplateClone = channelTemplate.content.cloneNode(true);
        let channelName = document.getElementById('channel-name-input').value;
        if (channelName == '') {
            console.log("In this branch")
            return;
        }
        else{

            // Create a new template that shows the newly created channel and
            // add it to the DOM
            channelTemplateClone.querySelector("#channel-name").innerHTML = channelName;
            channelTemplateClone.querySelector("#open-channel-btn").value = channelName;
            channelTemplateClone.querySelector('#open-channel-btn').addEventListener('click', function (event) {
                window.location.href = `/chat/${event.originalTarget.value}`;
            });
            console.log("From the create channel method")
            scroller.appendChild(channelTemplateClone);

            // Create an ajax GET request to let the server know the name of the new
            // channel
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", `/create/${channelName}`, true);
            xhttp.send();

            // Hide channel creaton template.
            // FIXME: This can be refactored
            newChannelTemplate.style.visibility='hidden';
        }

    }
    // Make channel creation template visible
    newChannelTemplate.style.visibility='visible';
}
// Function to request new items and render to the dom
function loadItems() {

  // Use fetch to request data and pass the counter value in the QS
  fetch("/load").then((response) => {

    // Convert the response data to JSON
    response.json().then((data) => {

      // If empty JSON, exit the function
      if (!data.length) {

        // Replace the spinner with "No more posts"
        sentinel.innerHTML = "No more posts";
        return;
      }

      // Iterate over the items in the response
      for (var i = 0; i < data[0].length; i++) {

        // Clone the HTML template
        let templateClone = channelTemplate.content.cloneNode(true);

        // Query & update the template content
        templateClone.querySelector("#channel-name").innerHTML = `${data[0][i]}`;

        // Add event listner to the button
        templateClone.querySelector("#open-channel-btn").value = `${data[0][i]}`;

        templateClone.querySelector("#open-channel-btn").addEventListener('click', function(event) {
                //var xhttpi = new XMLHttpRequest();
                //xhttp.open("GET", '/chat', true);
                //xhttp.send();
                console.log("From the load items method")
                console.log(event.originalTarget.value);
                window.location.href = `/chat/${event.originalTarget.value}`;
            });
        // Append template to dom
        scroller.appendChild(templateClone);

        // Increment the counter
        counter += 1;
      }
    })
  })
}

// Create a new IntersectionObserver instance
var intersectionObserver = new IntersectionObserver(entries => {

  // Uncomment below to see the entry.intersectionRatio when
  // the sentinel comes into view

  // entries.forEach(entry => {
  //   console.log(entry.intersectionRatio);
  // })

  // If intersectionRatio is 0, the sentinel is out of view
  // and we don't need to do anything. Exit the function
  if (entries[0].intersectionRatio <= 0) {
    return;
  }


// Call the loadItems function
loadItems();

});

// Instruct the IntersectionObserver to watch the sentinel
//intersectionObserver.observe(sentinel);


// Make the new channel template invisable
newChannelTemplate.style.visibility='hidden'

loadItems();

