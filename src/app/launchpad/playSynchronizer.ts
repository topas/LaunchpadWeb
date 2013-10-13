module Launchpad {

	export interface IPlaySynchronizer {
		play(sample: Sample);
	}

	export class PlaySynchronizer implements IPlaySynchronizer {

		private timeoutService: ng.ITimeoutService;
		private tempoDelay: number;
		private sampleQueue: Sample[];

		constructor(bpm: number, timeoutService: ng.ITimeoutService) {
			this.timeoutService = timeoutService;
			this.tempoDelay = this.getDelayByBpm(bpm);
			this.sampleQueue = [];

			this.setProcessInterval();
		}

		play(sample: Sample) {
			this.sampleQueue.push(sample);			
		}

		private processSampleQueue() {

			while (this.sampleQueue.length > 0)
			{
				var sample = this.sampleQueue.shift();
				sample.play();
			}
			this.setProcessInterval();
		}

		private setProcessInterval() {
			this.timeoutService(() => this.processSampleQueue(), this.tempoDelay);
		}

		private getDelayByBpm(bpm: number): number {
			var minute = 1000*60;	
			return (minute / bpm) * 4 * 4;
		}
	}
}