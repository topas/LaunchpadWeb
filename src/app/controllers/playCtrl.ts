/// <reference path="../launchpad/launchpadBoard.ts" />

module Launchpad {

	export interface IPlayScope  extends ng.IScope {
		board: LaunchpadBoard;
	}

	export class PlayCtrl { 

		constructor($scope: IPlayScope)
		{
			$scope.board = new LaunchpadBoard();
		}
	}

}