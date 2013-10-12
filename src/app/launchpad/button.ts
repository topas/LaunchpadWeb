module Launchpad {
	export class Button {
		private row: number;
		private column: number;
		public state: ButtonState;

		constructor(row: number, column: number) {
			this.row = row;
			this.column = column;
			this.state = ButtonState.Waiting;
		}

		click(): void {
			alert("click [" + this.row + "," + this.column + "]");
		}
	}
}