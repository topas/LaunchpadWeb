module Launchpad {

	export interface ITempoSynchronizer {
		play(sample: ISample);
		stop(sample: ISample);
	}

	export class TempoSynchronizer implements ITempoSynchronizer {

		private tickCount : number;
		private metronome: IMetronome;		
		private playSampleQueue: ISample[];
		private stopSampleQueue: ISample[];

		constructor(metronome: IMetronome) {
			this.metronome = metronome;
			this.playSampleQueue = [];
			this.stopSampleQueue = [];
			this.tickCount = 0;

			this.metronome.ticked().on(() => this.metronomeTicked());
		}

		play(sample: ISample) {
			this.playSampleQueue.push(sample);			
		}

		stop(sample: ISample) {
			this.stopSampleQueue.push(sample);							
		}

		private processSampleQueue() {

			while (this.stopSampleQueue.length > 0)
			{
				var sample = this.stopSampleQueue.shift();
				var index =  this.playSampleQueue.indexOf(sample);
				this.playSampleQueue.splice(index, 1);			
				sample.stop();
			}

			while (this.playSampleQueue.length > 0)
			{
				var sample = this.playSampleQueue.shift();
				sample.play();
			}
		}

		private metronomeTicked() {
			if (this.tickCount % 4 == 0) {
				this.processSampleQueue();
			}

			this.tickCount++;
		}		
	}
}