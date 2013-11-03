module Launchpad {

	export interface ISamplePlaySynchronizer {
		add(row: number, column: number, sample: ISample);	
		getRow(index: number): SampleRow;
		getColumn(index: number): SampleColumn;
	}

	export class SamplePlaySynchronizer implements ISamplePlaySynchronizer {
		rows: SampleRow[];
		columns: SampleColumn[];

		constructor() {
			this.columns = [];
			for(var column = 0; column < 8; column++) {
				this.columns.push(new SampleColumn(column));
			}

			this.rows = [];
			for(var row = 0; row < 8; row++) {
				this.rows.push(new SampleRow(row));
			}
		}

		add(row: number, column: number, sample: ISample) {
			this.columns[column].addSample(sample);
			this.rows[row].addSample(sample);
		}

		getRow(index: number): SampleRow {
			return this.rows[index];
		}

		getColumn(index: number): SampleColumn {
			return this.columns[index];
		}
	}
}