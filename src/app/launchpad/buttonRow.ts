module Launchpad {
	export class ButtonRow {
		private onButtonStateChanged = new LiteEvent<Button, ButtonState>(); 

		index: number;
		buttons: Button[];
		state: ButtonState;
		sampleManager: ISampleManager;	
		sampleRow: SampleRow;

		buttonStateChanged(): ILiteEvent<Button, ButtonState> { return this.onButtonStateChanged; }

		constructor(rowIndex: number, sampleRow: SampleRow, columns: ButtonColumn[], sampleManager: ISampleManager) {
			this.index = rowIndex;
			this.state = ButtonState.Disabled;
			this.buttons = [];
			this.sampleManager = sampleManager;			
			this.sampleRow = sampleRow;

			for(var columnIndex = 0; columnIndex < 8; columnIndex++) {
				var sample = this.sampleManager.get(rowIndex, columnIndex);
				var column = columns[columnIndex];
				var button = new Button(this, column, sample);
				button.stateChanged().on((button?: Button, state?: ButtonState) => this.onButtonStateChanged.trigger(button, state));
				column.addButton(button);
				this.addButton(button);
			}
			
		}

		addButton(button: Button) {
			this.buttons.push(button);
		}		
	}
}