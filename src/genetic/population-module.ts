export class PopulationModule {
    private populationSize: any;
    private evaluation: any;

    constructor(populationSize: any, evaluationModule: any) {
        this.populationSize = populationSize;
        this.evaluation = evaluationModule;
    }

    createInitial = (solutionSize: any) => {
        var population = [], packed, r;

        // create randomly a valid population
        while (population.length < this.populationSize) {
            var solution = [];

            // decide for each bit with p=0.5 if it is set or not.
            for (var s = 0; s < solutionSize; s++) {
                packed = Math.round(Math.random());
                solution.push(packed);
            }

            this.makeSolutionValid(solution);

            if (this.isNotDouble(solution, population)) {
                population.push(solution);
            }
        }

        return population;
    };

    copyLimited = (sourcePopulation: any, max: any) => {
        var result = [];

        if (sourcePopulation.length <= max) {
            return sourcePopulation;
        }

        for (var i = 0; i < max; i++) {
            result[i] = sourcePopulation[i];
        }

        return result;
    };

    makeSolutionValid = (solution: any) => {
        var r;
        while (this.evaluation.evaluate(solution) < 0) {
            r = Math.floor(Math.random() * solution.length);
            solution[r] = 0;
        }
    };

    isNotDouble = (solution:any, population:any) => {
        var isDouble = false;
        var isSame;

        for (var s = 0; s < population.length; s++) {
            isSame = true;
            for (var i = 0; i < solution.length; i++) {
                if (population[s][i] != solution[i]) {
                    isSame = false;
                    break;
                }
            }
            if (isSame) {
                isDouble = true;
                break;
            }
        }

        return !isDouble;
    };

    isValidAndNotDouble = (solution:any, population:any) => {
        var isValid = this.evaluation.evaluate(solution) >= 0;
        var isNotDouble = this.isNotDouble(solution, population);

        return isValid && isNotDouble;
    };

    replaceWorst = (population:any, fitnesses:any, offsprings:any) => {
        var n = offsprings.length;
        var    mapping = [];
        var    sanitizedOffsprings: any = [];

        // sanitizedOffsprings = this.copyLimited(offsprings, population.length);

        // create mapping so we can later on sort and still find the original solution
        // in the population.
        for (var i = 0; i < fitnesses.length; i++) {
            mapping.push({
                index: i,
                fitness: fitnesses[i]
            });
        }

        // sort by worst fitness
        mapping.sort(this.createSortWorstFitnessFirst(fitnesses));

        // replace the population solutions by their offsprings, beginning with
        // the worst solution and stop when no more offsprings are available.
        mapping.forEach(function (entry, i) {
            if (i < sanitizedOffsprings.length) {
                population[entry.index] = sanitizedOffsprings[i].slice(0);
            }
        });

    };

    createSortWorstFitnessFirst = (fitnesses:any) => {
        return (a:any, b:any) => {
            if (fitnesses[a.index] < fitnesses[b.index]) {
                return -1;
            }
            if (fitnesses[a.index] > fitnesses[b.index]) {
                return 1;
            }
            return 0;
        };
    };
}
