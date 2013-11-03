module Launchpad {

	export class SampleColumn { 
		private samples: ISample[];
		private index: number;

		constructor(index: number) {
			this.index = index;
			this.samples = [];			
		}

		addSample(sample: ISample) {
			this.samples.push(sample);
			sample.stateChanged().on((sample?: ISample, state?: SampleState) => this.sampleStateChanged(sample, state));
		}

		stop() {
			this.samples.forEach(s => s.stop());
		}

		private sampleStateChanged(sample?: ISample, state?: SampleState) {

			if (state == SampleState.Playing)
			{
				var otherSamples = this.samples.filter(s => s !== sample);
				otherSamples.forEach(s => s.stop());
			}
		}
	}

}