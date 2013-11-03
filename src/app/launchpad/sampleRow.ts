module Launchpad { 
	export class SampleRow { 
		private samples: ISample[];
		private index: number;

		constructor(index: number) {
			this.index = index;
			this.samples = [];			
		}

		addSample(sample: ISample) {
			this.samples.push(sample);
		}
	}
}