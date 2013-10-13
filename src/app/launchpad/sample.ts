module Launchpad {
	export class Sample {
		private onStateChanged = new LiteEvent<SampleState>(); 
		private instance: createjs.SoundInstance;
		private type: SampleType;

		src: string;
		state: SampleState;
		public get sampleChanged(): ILiteEvent<SampleState> { return this.onStateChanged; }

		constructor(src: string, type: SampleType) {
			this.src = src;			
			this.type = type;
			this.state = SampleState.None;
		}

		setSoundInstance(instance: createjs.SoundInstance) {
			this.instance = instance;
			this.setState(SampleState.Loaded);

			this.instance.addEventListener("complete", createjs.proxy(this.sampleCompleted, this));
		}

		play() { 
			var loop = (this.type == SampleType.Loop ? -1 : 0);
			// interrupt?: string, delay?: number, offset?: number, loop?: number, volume?: number, pan?: number
			this.instance.play(null, null, null, loop, null, null);
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