module Launchpad {
	export class Button {
		private row: ButtonRow;
		private column: ButtonColumn;
		private sample: ISample;		
		private onStateChanged = new LiteEvent<Button, ButtonState>(); 
		
		state: ButtonState;
		location: ButtonLocation;

		stateChanged(): ILiteEvent<Button, ButtonState> { return this.onStateChanged; }

		constructor(row: ButtonRow, column: ButtonColumn, sample: ISample) {
			this.row = row;
			this.column = column;
			this.location = new ButtonLocation(row.index, column.index);
			this.state = ButtonState.Disabled;
			this.sample = sample;			

			this.sample.stateChanged().on((sample?: ISample, state?: SampleState) => this.sampleStateChanged(state));			
		}

		click(): void {			
			this.sample.play();				
		}

		private sampleStateChanged(state: SampleState) {
			
			switch(state) {
				case SampleState.None:
					this.changeState(ButtonState.Disabled);	
					break;
				case SampleState.Waiting:
					this.changeState(ButtonState.Waiting);	
					break;
				case SampleState.Stopped:
					this.changeState(ButtonState.SampleLoaded);
					break;
				case SampleState.Loaded:
					this.changeState(ButtonState.SampleLoaded);
					break;
				case SampleState.Playing:
					this.changeState(ButtonState.Playing);
					break;
			}
		}

		private changeState(state: ButtonState) {
			this.state = state;
			this.onStateChanged.trigger(this, this.state);
		}
	}
}