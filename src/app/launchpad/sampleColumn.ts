module Launchpad {

	export class SampleColumn { 
		private samples: ISample[];
		private index: number;

		constructor(index: number) {
			this.index = index;
			this.samples = [];			
		}

		setSample(index: number, sample: ISample) {
			this.samples[index] = sample;
			sample.stateChanged().on((sample?: ISample, state?: SampleState) => this.sampleStateChanged(sample, state));
		}

		stop() {
			this.samples.forEach(s => s.stop());
		}

		private sampleStateChanged(sample?: ISample, state?: SampleState) {	

			if (state == SampleState.Playing)
			{
				var samplesToStop = this.samples.filter(s => s !== sample);
				if (sample.type() == SampleType.Empty) {
					samplesToStop = this.samples;				
				}

				samplesToStop.forEach(s => s.stop());
			}
		}
	}

}