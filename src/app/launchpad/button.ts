module Launchpad {
	export class Button {
		private row: ButtonRow;
		private column: ButtonColumn;
		private sample: ISample;		

		state: ButtonState;

		constructor(row: ButtonRow, column: ButtonColumn, sample: ISample) {
			this.row = row;
			this.column = column;
			this.state = ButtonState.Disabled;
			this.sample = sample;			

			if (this.sample != undefined)
			{
				this.sample.sampleChanged().on((state?: SampleState) => this.sampleStateChanged(state));
			}
		}

		click(): void {
			if (this.sample == undefined) {
				return;
			}

			if (this.sample.state == SampleState.Playing || 
				this.sample.state == SampleState.Waiting) {
				this.sample.stop();
			}
			else {
				this.sample.play();				
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

			if (state == SampleState.Waiting) {
				this.state = ButtonState.Waiting;	
			}
		}
	}
}