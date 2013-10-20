module Launchpad {
	export class Button {
		private row: number;
		private column: number;
		private sample: Sample;
		private playSynchronizer: IPlaySynchronizer;

		state: ButtonState;

		constructor(row: number, column: number, sample: Sample, playSynchronizer: IPlaySynchronizer) {
			this.row = row;
			this.column = column;
			this.state = ButtonState.Disabled;
			this.sample = sample;
			this.playSynchronizer = playSynchronizer;

			if (this.sample != undefined)
			{
				this.sample.sampleChanged().on((state?: SampleState) => this.sampleStateChanged(state));
			}
		}

		click(): void {
			if (this.sample == undefined) {
				return;
			}

			if (this.sample.state == SampleState.Playing) {
				this.sample.stop();
			}
			else {
				this.playSynchronizer.play(this.sample);
				this.state = ButtonState.Waiting;
			}
		}

		private sampleStateChanged(state: SampleState) {
			if (state == SampleState.Loaded) {
				this.state = ButtonState.SampleLoaded;
			}

			if (state == SampleState.Playing) {
				this.state = ButtonState.Playing;
			}

			if (state == SampleState.Stopped) {
				this.state = ButtonState.SampleLoaded;
			}
		}
	}
}