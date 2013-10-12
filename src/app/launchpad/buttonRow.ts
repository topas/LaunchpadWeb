module Launchpad {
	export class ButtonRow {
		public buttons: Button[];
		public state: ButtonState;

		constructor(rowIndex: number) {
			this.state = ButtonState.Waiting;
			this.buttons = [];
			for(var column = 0; column < 8; column++) {
				this.buttons.push(new Button(rowIndex, column));
			}
			
		}

		click(): void {
			for(var button in this.buttons) {
				button.play();
			}			
		}
	}
}