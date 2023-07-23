const http = require('http');

const videos = require('./data/sample');

// Function to make a POST request to the API
function makePostRequest(video) {
  const postData = JSON.stringify(video);

  const options = {
    hostname: 'localhost', // Replace with your actual API URL
    port: 3000, // Replace with the appropriate port
    path: '/media/new', // Replace with the endpoint to which you want to make the POST request
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status code: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`Response: ${chunk}`);
    });
  });

  req.on('error', (error) => {
    console.error(`Error occurred: ${error.message}`);
  });

  req.write(postData);
  req.end();
}

// Function to make POST requests for all videos in the array
function makePostRequestsForVideos() {
  for (const video of videos) {
    makePostRequest(video);
  }
}

// Call the function to initiate the POST requests
makePostRequestsForVideos();
