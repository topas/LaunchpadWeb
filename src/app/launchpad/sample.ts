module Launchpad {
	export class Sample {
		private onStateChanged = new LiteEvent<SampleState>(); 
		private instance: ISoundJsInstanceWrapper;
		private type: SampleType;

		src: string;
		state: SampleState;
		sampleChanged(): ILiteEvent<SampleState> { return this.onStateChanged; }

		constructor(src: string, type: SampleType) {
			this.src = src;			
			this.type = type;
			this.state = SampleState.None;
		}

		setSoundInstance(instance: ISoundJsInstanceWrapper) {
			this.instance = instance;
			this.setState(SampleState.Loaded);

			this.instance.completed().on(() => this.sampleCompleted());
		}

		play() { 
			if (this.type == SampleType.Loop) {
				this.instance.loop();
			}
			else {
				this.instance.play();
			}
			
			this.setState(SampleState.Playing);
		}

		stop() {
			this.instance.stop();
			this.setState(SampleState.Stopped);
		}

		private sampleCompleted() {
			this.setState(SampleState.Stopped);
		}

		private setState(state: SampleState) {
			if (this.state != state) {
				this.state = state;
				this.onStateChanged.trigger(state);
			}			
		}		
	}
}