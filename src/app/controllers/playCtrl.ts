/// <reference path="../launchpad/launchpadBoard.ts" />

module Launchpad {

	export interface IPlayScope  extends ng.IScope {
		board: LaunchpadBoard;
		progress: number;
		isButtonPlaying: Function;
	}

	export class PlayCtrl { 

		constructor($scope: IPlayScope, $timeout: ng.ITimeoutService)
		{
			$scope.progress = 0;

			$scope.board = new LaunchpadBoard($timeout, (total: number, loaded: number) => { this.updateProgress($scope, total, loaded) });
			$scope.isButtonPlaying = (button:Button) => this.isButtonPlaying(button);
		}

		isButtonPlaying(button: Button): boolean {
			return button.state == ButtonState.Playing || button.state == ButtonState.Waiting;
		}

		private updateProgress($scope, total: number, loaded: number) {			
			$scope.$apply(() => {
				$scope.progress = (loaded / total) * 100;			
				});			
		}
	}

}