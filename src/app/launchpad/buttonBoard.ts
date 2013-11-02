module Launchpad {

	export class ButtonBoard { 
		rows: ButtonRow[];
		columns: ButtonColumn[];

		constructor(sampleManager: ISampleManager) {

			this.columns = [];
			for(var column = 0; column < 8; column++) {
				this.columns.push(new ButtonColumn(column));
			}

			this.rows = [];
			for(var row = 0; row < 8; row++) {
				this.rows.push(new ButtonRow(row, this.columns, sampleManager));
			}			
		}

	}	
}