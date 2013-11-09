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

	}

	export class PlayCtrl { 
		private midiWrapper : IMidiApiWrapper;

		constructor($scope: IPlayScope, $timeout: ng.ITimeoutService)
		{
			this.midiWrapper = new MidiApiWrapper();
			this.midiWrapper.initOk().on((midiWrapper?: IMidiApiWrapper, dummy?: any) => this.setMidiInputsAndOutputs($scope, midiWrapper));

			$scope.progress = 0;	
			$scope.board = new LaunchpadBoard($timeout, this.midiWrapper, (total: number, loaded: number) => { this.updateProgress($scope, total, loaded) });
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
		}

		private midiSettingChanged($scope: IPlayScope) {
			this.midiWrapper.setInputByName($scope.midiInput);
			this.midiWrapper.setOutputByName($scope.midiOutput);
		}
	}

}