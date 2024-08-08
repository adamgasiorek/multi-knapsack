export class EvaluationModule {
    private problem: any;

    constructor() {
    }

    getWeight = (solution: any, constraint: any) => {
        var weight = 0;

        for (var i = 0; i < solution.length; i++) {
            if (solution[i] === 1) {
                weight += constraint.weights[i];
            }
        }

        return weight;
    };

    setProblem = (problem: any) => {
        this.problem = problem;
    };

    evaluate = (solution: any) => {
        var totalProfit = 0;

        for (var i = 0; i < solution.length; i++) {
            if (solution[i] === 1) {
                totalProfit += this.problem.profits[i];
            }
        }

        var contraintsMet = this.checkConstraints(solution);

        if (!contraintsMet) {
            return -1;
        }
        return totalProfit;
    };

    checkConstraints = (solution: any) => {
        var totalWeight, constraint, constraintMet, bagLimit;

        constraintMet = true;

        for (var c = 0; c < this.problem.constraints.length; c++) {
            constraint = this.problem.constraints[c];
            bagLimit = this.problem.constraints[c].bagLimit;
            totalWeight = this.getWeight(solution, constraint);
            if (totalWeight > bagLimit) {
                constraintMet = false;
                break;
            }
        }

        return constraintMet;
    };
}
