module Launchpad {

	export interface ITempoSynchronizer {
		play(sample: ISample);
		stop(sample: ISample);
	}

	export class TempoSynchronizer implements ITempoSynchronizer {

		private timeoutService: ng.ITimeoutService;
		private tempoDelay: number;
		private playSampleQueue: ISample[];
		private stopSampleQueue: ISample[];

		constructor(bpm: number, timeoutService: ng.ITimeoutService) {
			this.timeoutService = timeoutService;
			this.tempoDelay = this.getDelayByBpm(bpm);
			this.playSampleQueue = [];
			this.stopSampleQueue = [];

			this.setProcessInterval();
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