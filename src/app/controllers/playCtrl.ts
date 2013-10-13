/// <reference path="../launchpad/launchpadBoard.ts" />

module Launchpad {

	export interface IPlayScope  extends ng.IScope {
		board: LaunchpadBoard;
		isButtonPlaying: Function;
	}

	export class PlayCtrl { 

		constructor($scope: IPlayScope, $timeout: ng.ITimeoutService)
		{
			$scope.board = new LaunchpadBoard($timeout);
			$scope.isButtonPlaying = (button:Button) => this.isButtonPlaying(button);
		}

		isButtonPlaying(button: Button): boolean {
			return button.state == ButtonState.Playing || button.state == ButtonState.Waiting;
		}
	}

}