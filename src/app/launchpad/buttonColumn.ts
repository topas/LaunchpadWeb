module Launchpad {

	export class ButtonColumn {
		index: number;
		buttons: Button[];
		sampleColumn: SampleColumn;
		volume: number;

		constructor(columnIndex: number, sampleColumn: SampleColumn) {
			this.index = columnIndex;
			this.sampleColumn = sampleColumn;
			this.buttons = [];
			this.volume = 90;
			this.volumeChanged();
		}

		addButton(button: Button) {
			this.buttons.push(button);
		}

		stop() { 
			this.sampleColumn.stop();
		}

		volumeChanged() {
			this.sampleColumn.setVolume(this.volume);
		}
	}
	
}