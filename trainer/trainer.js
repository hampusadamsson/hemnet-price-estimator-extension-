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

regression.
console.log(result.slice(0,3));
