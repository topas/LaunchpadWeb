module Launchpad {

	export class SampleProgress {
		changed(): ILiteEvent<SampleProgress, any> { return this.onChanged; }

		barsCount : number;
		beatsCount : number;
		progress: number;

		private sample : ISample;
		private onChanged = new LiteEvent<SampleProgress, any>(); 

		constructor(barsCount: number, metronome: IMetronome) {
			this.barsCount = barsCount;
			this.beatsCount = this.barsCount * 4;			
			this.progress = 1;
			metronome.ticked().on(() => this.metronomeTicked());
		}

		setSample(sample: ISample) {
			this.sample = sample;
		}

		private metronomeTicked() {
			if (this.sample.state == SampleState.Playing) {
				var newProgress = this.progress + 1;

				if (newProgress > this.beatsCount) {
					newProgress = 1;
				}
				this.changeProgress(newProgress);				
			}
			else {
				this.changeProgress(0);
			}
		}

		private changeProgress(newProgress: number) {
			if (newProgress != this.progress) {				
				this.progress = newProgress;
				this.onChanged.trigger(this);	
			}			
		}
	}
}