import {ReproductionModule} from "./reproduction-module";
import {PopulationModule} from "./population-module";
import {EvaluationModule} from "./evaluation-module";

export class Genetic {
    private params: any;
    private reproductionModule: ReproductionModule;
    private populationModule: PopulationModule;
    private evaluationModule: EvaluationModule;
    private problem: any;
    private currentPopulation: any;
    private generationCounter: any;
    private statistics: any;

    constructor(params: any) {
        this.params = params;
        this.evaluationModule = new EvaluationModule();
        this.populationModule = new PopulationModule(this.params.populationSize, this.evaluationModule);
        this.reproductionModule = new ReproductionModule(this.evaluationModule, this.populationModule, this.params.mutateProbability, this.params.crossoverProbability);
    }

    insertChildren = (children: any, offspringPopulation: any) => {
        var pop = this.populationModule;

        for (var i = 0; i < children.length; i++) {
            if (pop.isValidAndNotDouble(children[i], offspringPopulation)) {
                offspringPopulation.push(children[i]);
            }
        }
    };

    solve = (problem: any) => {
        this.problem = problem;
        this.currentPopulation = [];
        this.generationCounter = 0;

        this.initPopulationStatistics();
        this.initModules();

        this.solveProblemInternal();
    };

    initPopulationStatistics = () => {
        this.statistics = {};
        this.statistics.bestFitness = [];
        this.statistics.averageFitness = [];
    };

    initModules = () => {
        this.evaluationModule.setProblem(this.problem);
    };

    solveProblemInternal = () => {
        var populationSize = this.problem.profits.length;
        this.currentPopulation = this.populationModule.createInitial(populationSize);
        this.stepAndEnqueue();
    };

    stepAndEnqueue = () => {
        this.logCurrentPopulation();

        this.storePopulationStatistics();

        if (this.isGenerationLimitReached()) {
            this.analyzeBestSolution();
        } else {
            this.generateOffspringPopulation();
            setTimeout(this.stepAndEnqueue.bind(this), this.params.delay);
        }
    };

    logCurrentPopulation = () => {
        var best = this.reproductionModule.getFittestSolution(this.currentPopulation);
        var quality = this.evaluationModule.evaluate(best);


        console.log( quality);
    };

    isGenerationLimitReached = () => {
        return this.generationCounter === this.params.generationsLimit;
    };

    analyzeBestSolution = () => {
        var best = this.reproductionModule.getFittestSolution(this.currentPopulation);
        var quality = this.evaluationModule.evaluate(best);

        console.log("total best solution with profit {} is {} (optimal: {})",
            quality, best.slice(0, 10), this.problem.optimal );

    };

    storePopulationStatistics = () => {
        var gen = this.generationCounter;
        var pop = this.currentPopulation;
        var totalFitness = 0;
        var averageFitness;
        var bestFitness;
        var bestSolution;

        for (var i = 0; i < pop.length; i++) {
            totalFitness += this.reproductionModule.getFitness(pop[i]);
        }
        averageFitness = totalFitness/pop.length;

        bestSolution = this.reproductionModule.getFittestSolution(pop);
        bestFitness = this.reproductionModule.getFitness(bestSolution);

        this.statistics.bestFitness.push([gen, bestFitness]);
        this.statistics.averageFitness.push([gen, averageFitness]);
    };

    generateOffspringPopulation = () => {
        var offspringPopulation: any = [],
            probabilites = [],
            fitnesses = [],
            reproduction = this.reproductionModule,
            parents,
            children,
            offspringsLimit;

        offspringsLimit = this.params.offspringsProportion * this.params.populationSize;
        probabilites = reproduction.computeProbabilites(this.currentPopulation);
        while (offspringPopulation.length < offspringsLimit) {
            parents = reproduction.getParents(this.currentPopulation, probabilites);
            children = reproduction.getOffsprings(parents);

            this.insertChildren(children, offspringPopulation);
        }

        fitnesses = this.getFitnessValuesOfCurrentPopulation();

        this.populationModule.replaceWorst(this.currentPopulation,
            fitnesses, offspringPopulation);

        this.generationCounter++;
    };

    getFitnessValuesOfCurrentPopulation = () => {
        var pop = this.currentPopulation;
        var result = [];

        for (var i = 0; i < pop.length; i++) {
            result.push(this.reproductionModule.getFitness(pop[i]));
        }

        return result;
    };
}
