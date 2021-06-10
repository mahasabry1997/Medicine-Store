var GeneticAlgorithmConstructor = require('geneticalgorithm')
var geneticalgorithm = GeneticAlgorithmConstructor( config )
var config = {
    mutationFunction: aMutationFunctionYouSupply,
    crossoverFunction: yourCrossoverFunction,
    fitnessFunction: yourFitnessFunction,
    doesABeatBFunction: yourCompetitionFunction,
    population: [ /* one or more phenotypes */ ],
    populationSize: aDecimalNumberGreaterThanZero 	// defaults to 100
}
var GeneticAlgorithmConstructor = require('geneticalgorithm')
var geneticalgorithm = GeneticAlgorithmConstructor( config )
var anotherGA = geneticalgorithm.clone()
var anotherWithLargePopulation = geneticalgorithm.clone({
    populationSize : 1000
})
var size = geneticalgorithm.config().populationSize
var biggerGeneticAlgorithm = geneticalgorithm.config({
    populationSize = size * 1.10
})
geneticalgorithm.evolve( )