module Launchpad {

	export class SynchronizedSample extends SampleBase {

		private sample: ISample;
		private tempoSynchronizer: ITempoSynchronizer;

		constructor(sample: ISample, tempoSynchronizer: ITempoSynchronizer) {
			super();
			this.sample = sample;
			this.tempoSynchronizer = tempoSynchronizer;
			this.sample.sampleChanged().on((state?: SampleState) => this.internalSampleStateChanged(state));
		}

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
			this.tempoSynchronizer.stop(this.sample);
		}

		private internalSampleStateChanged(state: SampleState) {
			console.debug(""+state);
			this.setState(state);
		}
	}

}