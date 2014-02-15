module Launchpad {

	export interface IMetronome {
		ticked(): ILiteEvent<IMetronome, any>;
	}


	export class Metronome implements IMetronome {
		private onTicked = new LiteEvent<IMetronome, any>(); 

		private oneBarDelay: number;
		private timeoutService: ng.ITimeoutService;

		ticked(): ILiteEvent<Button, ButtonState> { return this.onTicked; }

		constructor(bpm: number, timeoutService: ng.ITimeoutService) {
			this.oneBarDelay = this.getBarDelayByBpm(bpm);
			this.timeoutService = timeoutService;

			this.setMetronomeInterval();
		}	

		private metronomeTick() {
			this.onTicked.trigger(this);
			this.setMetronomeInterval();			
		}

		private setMetronomeInterval() {
		    this.timeoutService(() => this.metronomeTick(), this.oneBarDelay);
		}

		private getBarDelayByBpm(bpm: number): number {
			var minute = 1000*60;
			var barLength = 4;
			return (minute / bpm) * barLength;
		}
	}
} 
