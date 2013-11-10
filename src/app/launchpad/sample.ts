module Launchpad {

	export class Sample extends SampleBase {
		private instance: ISoundJsInstanceWrapper;
		private sampleType: SampleType;
		private srcPath: string;			

		constructor(src: string, sampleType: SampleType) {
			super();
			this.srcPath = src;			
			this.sampleType = sampleType;			
		}

		type(): SampleType { return this.sampleType; }

		setSoundInstance(instance: ISoundJsInstanceWrapper) {
			this.instance = instance;
			this.setState(SampleState.Loaded);

			this.instance.completed().on(() => this.sampleCompleted());
		}

		src() : string { 
			return this.srcPath; 
		}

		play() { 
			if (this.sampleType == SampleType.Loop) {
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
	}
}