/*Cancer Diagnosis via KNN
 *
 * RUNNING THE CODE:
 *
 * To run the code, simply open the index.html file in this folder (if on mac, double clicking on index.html should open it in a browser).
 * Then open up your console and check the output :D. Refresh the page to re-run the code!
 
 */

var CLASSIFICATION_INDEX = 10;  // in our training and test data, the delineator of being or malignant occurs at index 10
var K = 10;                      // We classify the test data using the K closest test entries
var BENIGN = 2;                 // Samples with classification of "2" are Benign
var MALIGNANT = 4;              // Samples with classification of "4" are Malignant

// Global variables for storing our samples. 
//  - trainingData: an Array of 628 training instances. Each training instance is represented as an Array with 11 values.
//  - testData: an Array of 71 test instances. Each test instance is represented as an Array with 11 values.
var trainData;            
var testData;



// (1) When we load the script, we read in our training and test data from CSV's and store them in global variables.
loadData();
kNN();

// (2) We then run kNN to classify our test instances

// Calculates the Euclidean distance between two instances of our data.
function calculateDistance(instance1, instance2) {
    var dist = 0

    for (var i = 0; i < CLASSIFICATION_INDEX; i++) {
      dist += (instance1[i] - instance2[i]) ** 2;
    }

    return Math.sqrt(dist);
}


function kNN() {
  /* myResults: Array of 2s and 4s, one element for each test instance in testData.
	   Each element at index i corresponds to a prediction for index i in the testData. */
  var myResults = [];

  for (var i = 0; i < testData.length; i++) {
      var testInstance = testData[i];

      var topResults = [];
        for (var j = 0; j < trainData.length; j++) {
          var trainInstance = trainData[j];
          var dist = calculateDistance(testInstance, trainInstance);
      
          var cur_obj = {distance: dist, class: trainInstance[CLASSIFICATION_INDEX]};
          var num_results = topResults.length;
      
          if (num_results < K) {
            topResults.push(cur_obj);
          } else {
            //arrange our topResults array in ascending order
            topResults.sort(function f(a, b) {return a.distance - b.distance});
            if (topResults[num_results - 1].distance > dist) {
              topResults.pop();
              topResults.push(cur_obj);
            }
          }
        }
  
      
      /* 
       Our prediction will be the classification that appears most frequently in topResults, and then
       we will store the prediction (either 2 or 4) in myResults.*/
      var benign_ct = 0;
      var malig_ct = 0;

      for (var k = 0; k < topResults.length; k++) {
        if (topResults[k].class == 2) {
          benign_ct++; 
        } else {
          malig_ct++;

        }
       }
      
    // if the test instance has a larger amount of malignant neighbors, we will classify it as malignant, and vice versa
    if (benign_ct > malig_ct) {
      myResults.push(2);
    } else {
      myResults.push(4);
    }
  }
  // printing our # of neighbors and accuracy to the console and the HTML file
  var newAccuracy = printAccuracy(myResults)
  console.log("Final Accuracy: " + newAccuracy);
  

  document.addEventListener("DOMContentLoaded", function() {
    var header2Element = document.getElementById("header2");
    header2Element.innerHTML = "k-nearest neighbors: " + K;
    var header3Element = document.getElementById("header3");
    var newAccuracy = printAccuracy(myResults);
    console.log("Final Accuracy: " + newAccuracy);
    header3Element.innerHTML = "Accuracy: " + newAccuracy; 
  });


}

// Computes accuracy of given results array.
function printAccuracy(myResults) {
  if (myResults.length !== testData.length) {
    return "Please provide exactly one classification for each test instance.";
  }
  var totalTestInstances = testData.length;
  var correctClassifications = 0;
  for (var i = 0; i < myResults.length; i++) {
    var currResult = myResults[i];
    var correctResult = testData[i][CLASSIFICATION_INDEX];
    if (currResult === correctResult) {
      correctClassifications++;
    }
  }
  var percentAccuracy = correctClassifications / totalTestInstances * 100;
  percentAccuracy = percentAccuracy.toFixed(2);
  return percentAccuracy;
}