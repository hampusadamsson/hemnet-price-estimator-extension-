import { RandomForestRegression as RFRegression } from 'ml-random-forest';
import {dataset} from './data.js';

const trainingSet = new Array(dataset.length);
const predictions = new Array(dataset.length);
 
for (let i = 0; i < dataset.length; ++i) {
  trainingSet[i] = dataset[i].slice(1, 14);
  predictions[i] = dataset[i][0];
}
 
const options = {
  seed: 3,
  maxFeatures: 2,
  replacement: false,
  nEstimators: 200
};
 
const regression = new RFRegression(options);
regression.train(trainingSet, predictions);
const result = regression.predict(trainingSet);

console.log(result);


// 1) send message to content - ready to predict
// 2) receive data (features) to predict
// 3) Return predicted value
function sendMessage(payload){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, payload, function(response) {
            console.log(response);
            const result = regression.predict(response.data);
            console.log(result);
            const responsePayload = {
                action: "updatePrice",
                predictedPrice: result
            }
            chrome.tabs.sendMessage(tabs[0].id, responsePayload, function(response) {
                console.log("OK");
            });
            return response;
        }); 
    });     
}

// Trigger on page load
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        console.log("Ready");
        sendMessage({action: "readyToPredict"});
    }
})