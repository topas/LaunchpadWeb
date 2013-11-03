module Launchpad { 

	export interface ISample { 
		state: SampleState;	
		stateChanged(): ILiteEvent<ISample, SampleState>;

		src(): string;
		setSoundInstance(instance: ISoundJsInstanceWrapper);
		play();
		stop();
	}

	export class SampleBase implements ISample {
		private onStateChanged = new LiteEvent<ISample, SampleState>(); 

		state: SampleState;				
		stateChanged(): ILiteEvent<ISample, SampleState> { return this.onStateChanged; }

		constructor() {
			this.state = SampleState.None;
		}

		setSoundInstance(instance: ISoundJsInstanceWrapper) { throw "Abstract method"; }
		src(): string { throw "Abstract method"; }
		play() { throw "Abstract method";}
		stop() { throw "Abstract method";}

		public setState(state: SampleState) {			
			this.state = state;
			this.onStateChanged.trigger(this, state);						
		}	

	}
}