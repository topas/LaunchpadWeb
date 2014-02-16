module Launchpad { 

	export interface ISample { 
		state: SampleState;	
		type(): SampleType;
		stateChanged(): ILiteEvent<ISample, SampleState>;
		progress: SampleProgress;

		src(): string;
		setSoundInstance(instance: ISoundJsInstanceWrapper);
		play();
		stop();
		setVolume(volume: number);
	}

	export class SampleBase implements ISample {
		private onStateChanged = new LiteEvent<ISample, SampleState>(); 

		state: SampleState;
		progress: SampleProgress;

		stateChanged(): ILiteEvent<ISample, SampleState> { return this.onStateChanged; }

		constructor(progress: SampleProgress) {
			this.state = SampleState.None;
			this.progress = progress; 
		}

		type(): SampleType { throw "Abstract method"; }
		setSoundInstance(instance: ISoundJsInstanceWrapper) { throw "Abstract method"; }
		src(): string { throw "Abstract method"; }
		play() { throw "Abstract method"; }
		stop() { throw "Abstract method"; }
		setVolume(volume: number) { throw "Abstract method"; }

		public setState(state: SampleState) {			
			this.state = state;
			this.onStateChanged.trigger(this, state);						
		}	
	}
}