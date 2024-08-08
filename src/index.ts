import * as sample2 from './data/sample.json';
import {Genetic} from "./genetic/genetic";

// problemIndex = parseInt($('#problemIndex').val());


const geneticParams = {
    delay: 1,
    mutateProbability: 0.3,
    crossoverProbability: 0.8,
    generationsLimit: 100,
    populationSize: 1000,
    offspringsProportion: 0.5
};
console.log('start');
const genetic = new Genetic(geneticParams);
genetic.solve(sample2);
