module Launchpad {
	export class ButtonRow {
		buttons: Button[];
		state: ButtonState;
		sampleManager: ISampleManager;
		playSynchronizer: IPlaySynchronizer;

		constructor(rowIndex: number, sampleManager: ISampleManager, playSynchronizer: IPlaySynchronizer) {
			this.state = ButtonState.Disabled;
			this.buttons = [];
			this.sampleManager = sampleManager;
			this.playSynchronizer = playSynchronizer;

			for(var column = 0; column < 8; column++) {
				var sample = this.sampleManager.get(rowIndex, column);
				this.buttons.push(new Button(rowIndex, column, sample, playSynchronizer));
			}
			
		}

		click(): void {
			for(var button in this.buttons) {
				button.play();
			}			
		}
	}
}