module Launchpad {

	export interface ITempoSynchronizer {
		play(sample: ISample);
		stop(sample: ISample);
	}

	export class TempoSynchronizer implements ITempoSynchronizer {

		private timeoutService: ng.ITimeoutService;
		private tempoDelay: number;
		private sampleQueue: ISample[];

		constructor(bpm: number, timeoutService: ng.ITimeoutService) {
			this.timeoutService = timeoutService;
			this.tempoDelay = this.getDelayByBpm(bpm);
			this.sampleQueue = [];

			this.setProcessInterval();
		}

		play(sample: ISample) {
			this.sampleQueue.push(sample);			
		}

		stop(sample: ISample) {
			var index =  this.sampleQueue.indexOf(sample);
			this.sampleQueue.splice(index, 1);			
			sample.stop();
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