module Launchpad {
	export class ButtonRow {
		index: number;
		buttons: Button[];
		state: ButtonState;
		sampleManager: ISampleManager;	

		constructor(rowIndex: number, columns: ButtonColumn[], sampleManager: ISampleManager) {
			this.index = rowIndex;
			this.state = ButtonState.Disabled;
			this.buttons = [];
			this.sampleManager = sampleManager;			

			for(var columnIndex = 0; columnIndex < 8; columnIndex++) {
				var sample = this.sampleManager.get(rowIndex, columnIndex);
				var column = columns[columnIndex];
				var button = new Button(this, column, sample);
				column.addButton(button);
				this.addButton(button);
			}
			
		}

		addButton(button: Button) {
			this.buttons.push(button);
		}		
	}
}