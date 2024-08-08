export class ReproductionModule {
    private evaluationModule: any;
    private populationModule: any;
    private mutateProbability: any;
    private crossoverProbability: any;

    constructor(evaluationModule: any, populationModule: any, mutateProbability: any, crossoverProbability: any) {
        this.evaluationModule = evaluationModule;
        this.populationModule = populationModule;
        this.mutateProbability = mutateProbability;
        this.crossoverProbability = crossoverProbability;
    }

    getFitness = (solution:any) => {
        return this.evaluationModule.evaluate(solution);
    };

    getFittestSolution = (population: any) => {
        var highestFitness = -1,
            fittestSolution: any = [],
            fitness,
            repoModule = this;

        population.forEach((solution: any) => {
            fitness = repoModule.getFitness(solution);
            if (fitness > highestFitness) {
                highestFitness = fitness;
                fittestSolution = solution;
            }
        });

        return fittestSolution;
    };

    computeProbabilites = (population: any) => {
        var probabilites: any = [],
            fitnesses: any = [],
            fitness,
            totalFitness = 0,
            p,
            self = this;

        population.forEach((solution: any) => {
            fitness = self.getFitness(solution);
            totalFitness += fitness;
            fitnesses.push(fitness);
        });

        fitnesses.forEach((fitness: any) => {
            p = fitness / totalFitness;
            probabilites.push(p);
        });

        return probabilites;
    };

    getParents = (population: any, probabilites: any) => {
        var parents = [],
            r, parent, intervals = [], isDouble;

        intervals = this.createProbabilityIntervals(probabilites);

        while (parents.length < 2) {
            r = Math.random();
            parent = this.getSolutionByProbability(population, intervals, r);

            if (this.populationModule.isNotDouble(parent, parents)) {
                parents.push(parent);
            }
        }

        return parents;
    };

    createProbabilityIntervals = (probabilites: any) => {
        var intervals = [];
        var interval: any;

        for (var i = 0; i < probabilites.length; i++) {
            interval = {};
            interval.from = i === 0 ? 0 : intervals[i - 1].to;
            interval.to = interval.from + probabilites[i];

            intervals.push(interval);
        }

        return intervals;
    };

    isProbable = (probability: any) => {
        return Math.random() <= probability;
    };

    getSolutionByProbability = (population: any, intervals: any, r: any) => {
        var solution;
        for (var i = 0; i < intervals.length; i++) {
            if (r >= intervals[i].from && r < intervals[i].to) {
                solution = population[i];
                break;
            }
        }

        return solution;
    };

    getOffsprings = (parents: any) => {
        var offsprings = [];
        var parentIndex;
        var c1, c2;

        c1 = parents[0].slice(0);
        c2 = parents[1].slice(0);

        if (this.isProbable(this.crossoverProbability)) {
            for (var i = 0; i < parents[0].length; i++) {
                parentIndex = this.isProbable(0.5) ? 0 : 1;

                c1[i] = parents[parentIndex][i];
                c2[i] = parents[1 - parentIndex][i];
            }

            this.mutate(c1);
            this.mutate(c2);
        }

        offsprings.push(c1);
        offsprings.push(c2);

        return offsprings;
    };

    mutate = (solution: any) => {
        if (this.isProbable(this.mutateProbability)) {
            var pos = Math.floor(Math.random() * solution.length);
            solution[pos] = 1 - solution[pos];
        }
    };

}
