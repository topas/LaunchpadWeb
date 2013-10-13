module Launchpad {
	export class LaunchpadBoard {
		public buttonRows: ButtonRow[]; 

		constructor(timeoutService: ng.ITimeoutService) {

			var mgr = new SampleManager("./sounds/");

			mgr.add(0, 0, "skipyofficialmusic-drums1.wav", SampleType.Loop);
			mgr.add(0, 1, "skyhunter-dubstep-dirty-wobble-bass.wav", SampleType.Loop);
			


			mgr.add(1, 2, "skipyofficialmusic-dark-dubstep-loop.wav", SampleType.Loop);
			mgr.add(1, 3, "skipyofficialmusic-heavy-dubstep-sytnth.wav", SampleType.Loop);
			mgr.add(1, 4, "skipyofficialmusic-heavy-dubstep-wobble.wav", SampleType.Loop);

			mgr.add(2, 1, "skipyofficialmusic-jump-up-synth.wav", SampleType.Loop);
			mgr.add(2, 2, "skipyofficialmusic-skrillex-summit-lead.wav", SampleType.Loop);


			var playSynchronizer = new PlaySynchronizer(140, timeoutService);

			this.buttonRows = [];
			for(var row = 0; row < 8; row++) {
				this.buttonRows.push(new ButtonRow(row, mgr, playSynchronizer));
			}

			mgr.loadSamples();

		}
	}
}