module Launchpad {

	export class ButtonColumn {
		index: number;
		buttons: Button[];
		sampleColumn: SampleColumn;

		constructor(columnIndex: number, sampleColumn: SampleColumn) {
			this.index = columnIndex;
			this.sampleColumn = sampleColumn;
			this.buttons = [];
		}

		addButton(button: Button) {
			this.buttons.push(button);
		}

		stop() { 
			this.sampleColumn.stop();
		}
	}
	
}