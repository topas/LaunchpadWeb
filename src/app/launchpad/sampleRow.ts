module Launchpad { 
	export class SampleRow { 
		private samples: ISample[];
		private index: number;

		constructor(index: number) {
			this.index = index;
			this.samples = [];			
		}

		setSample(index: number, sample: ISample) {
			this.samples[index] = sample;
		}
	}
}