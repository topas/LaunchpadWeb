module Launchpad {
	export class LaunchpadBoard {
		buttonRows: ButtonRow[]; 

		constructor() {
			this.buttonRows = [];
			for(var row = 0; row < 8; row++) {
				this.buttonRows.push(new ButtonRow(row));
			}
		}
	}
}