module Launchpad {

	export class ButtonColumn {
		index: number;
		buttons: Button[];

		constructor(columnIndex: number) {
			this.index = columnIndex;
			this.buttons = [];
		}

		addButton(button: Button) {
			this.buttons.push(button);
		}
	}
	
}