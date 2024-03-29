module Launchpad {

	export class ButtonBoard { 
		private onButtonStateChanged = new LiteEvent<Button, ButtonState>(); 
		private lauchpadMidi: ILaunchpadMidi;

		rows: ButtonRow[];
		columns: ButtonColumn[];	

		buttonStateChanged(): ILiteEvent<Button, ButtonState> { return this.onButtonStateChanged; }

		constructor(sampleManager: ISampleManager, samplePlaySynchronizer: ISamplePlaySynchronizer, lauchpadMidi: ILaunchpadMidi) {
			this.lauchpadMidi = lauchpadMidi;
			this.lauchpadMidi.initialized().on(() => this.midiInitialized());
			this.lauchpadMidi.buttonPressed().on((lauchpadMidi?: ILaunchpadMidi, location?: ButtonLocation) => this.midiButtonPressed(location));

			this.columns = [];
			for(var column = 0; column < 8; column++) {
				this.columns.push(new ButtonColumn(column, samplePlaySynchronizer.getColumn(column)));
			}

			this.rows = [];
			for(var row = 0; row < 8; row++) {
				var buttonRow = new ButtonRow(row, samplePlaySynchronizer.getRow(row), this.columns, sampleManager);
				buttonRow.buttonStateChanged().on((button?: Button, state?: ButtonState) => this.updateButtonState(button, state));
				this.rows.push(buttonRow);
			}				
		}

		private midiButtonPressed(location: ButtonLocation) {

			if (location.row >= 0 && location.row < 8 && 
				location.column >= 0 && location.column < 8)
			{
				this.rows[location.row].buttons[location.column].click();	
			}			
		}

		private midiInitialized() {
			for(var row = 0; row < 8; row++) {
				for(var column = 0; column < 8; column++) {
					var button = this.rows[row].buttons[column];
					this.updateButtonState(button, button.state);
				}
			}
		}

		private updateButtonState(button: Button, state: ButtonState) {
			this.onButtonStateChanged.trigger(button, state);
			switch(button.state) {
				case ButtonState.Disabled:
					this.lauchpadMidi.setButton(button.location, LaunchpadMidiButtonColor.Off);
					break;
				case ButtonState.SampleLoaded:
					this.lauchpadMidi.setButton(button.location, LaunchpadMidiButtonColor.Yellow);
					break;
				case ButtonState.Waiting:
					this.lauchpadMidi.setButton(button.location, LaunchpadMidiButtonColor.GreenFlashing);
					break;
				case ButtonState.Playing: 		
					this.lauchpadMidi.setButton(button.location, LaunchpadMidiButtonColor.Green);
					break;
			}
		}

	}	
}