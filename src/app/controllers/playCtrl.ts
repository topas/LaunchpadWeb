/// <reference path="../launchpad/launchpadBoard.ts" />

module Launchpad {

	export interface IPlayScope  extends ng.IScope {
		midiInputs: string[];
		midiInput: string;
		midiOutputs: string[];
		midiOutput: string;
		midiSettingChanged: Function;

		board: LaunchpadBoard;
		progress: number;
		isSampleLoaded: Function;
		midiError: boolean;
	}

	export class PlayCtrl { 
		private midiWrapper : IMidiApiWrapper;

		constructor($scope: IPlayScope, $timeout: ng.ITimeoutService)
		{
			this.midiWrapper = new MidiApiWrapper();
			this.midiWrapper.initOk().on((midiWrapper?: IMidiApiWrapper, dummy?: any) => this.setMidiInputsAndOutputs($scope, midiWrapper));
			this.midiWrapper.initFailed().on(() => { $scope.midiError = true; })

			$scope.progress = 0;	
			$scope.board = new LaunchpadBoard($timeout, this.midiWrapper, (total: number, loaded: number) => { this.updateProgress($scope, total, loaded) });
			$scope.board.changed().on(() => this.lauchpadBoardChanged($scope));
			$scope.isSampleLoaded = (button:Button) => this.isSampleLoaded(button);
			$scope.midiSettingChanged = () => this.midiSettingChanged($scope);
		}

		isSampleLoaded(button: Button): boolean {
			return button.state == ButtonState.SampleLoaded || 
				   button.state == ButtonState.Playing || 
				   button.state == ButtonState.Waiting;
		}

		private updateProgress($scope, total: number, loaded: number) {			
			$scope.$apply(() => {
				$scope.progress = (loaded / total) * 100;			
				});			
		}

		private setMidiInputsAndOutputs($scope: IPlayScope, midiWrapper: IMidiApiWrapper) {
			$scope.midiInputs = midiWrapper.getInputNames();
			$scope.midiOutputs = midiWrapper.getOutputNames();

			// try find launchpad input and output 
			$scope.midiInput = $scope.midiInputs.filter(a => a == "Launchpad")[0];
			$scope.midiOutput = $scope.midiOutputs.filter(a => a == "Launchpad")[0];
			if ($scope.midiInput && $scope.midiOutput)
			{
				this.midiSettingChanged($scope);
			}	
		}

		private midiSettingChanged($scope: IPlayScope) {
			this.midiWrapper.setInputByName($scope.midiInput);
			this.midiWrapper.setOutputByName($scope.midiOutput);
		}

		private lauchpadBoardChanged($scope: IPlayScope) {
			setTimeout(() => { $scope.$apply()}, 1);
		}
	}

}