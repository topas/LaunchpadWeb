module Launchpad {

	export class SynchronizedSample extends SampleBase {

		private sample: ISample;
		private tempoSynchronizer: ITempoSynchronizer;

		constructor(sample: ISample, tempoSynchronizer: ITempoSynchronizer) {
			super();
			this.sample = sample;
			this.tempoSynchronizer = tempoSynchronizer;
			this.sample.stateChanged().on((sample?: ISample, state?: SampleState) => this.internalSampleStateChanged(sample, state));
		}

		type(): SampleType { return this.sample.type(); }

		src(): string {
			return this.sample.src();
		}

		setSoundInstance(instance: ISoundJsInstanceWrapper) {
			this.sample.setSoundInstance(instance);
		}

		play() {
			this.setState(SampleState.Waiting);
			this.tempoSynchronizer.play(this.sample);			
		}

		stop() {
			this.setState(SampleState.Waiting);
			this.tempoSynchronizer.stop(this.sample);
		}

		private internalSampleStateChanged(sample: ISample, state: SampleState) {			
			this.setState(state);
		}
	}

}