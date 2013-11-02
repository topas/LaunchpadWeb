module Launchpad {
	export class LaunchpadBoard {
		buttons: ButtonBoard;
		
		constructor(timeoutService: ng.ITimeoutService, progressCallback: (total: number, loaded: number) => any) {

			var soundJsWrapper = new SoundJsWrapper();			
			var tempoSynchronizer = new TempoSynchronizer(140, timeoutService);
			var mgr = new SampleManager(soundJsWrapper, "./sounds/", tempoSynchronizer);
			mgr.progressCallback = progressCallback;

			mgr.add(0, 0, "skipyofficialmusic-drums1.wav", SampleType.Loop);
			mgr.add(0, 1, "skyhunter-dubstep-dirty-wobble-bass.wav", SampleType.Loop);
			

			mgr.add(1, 2, "skipyofficialmusic-dark-dubstep-loop.wav", SampleType.Loop);
			mgr.add(1, 3, "skipyofficialmusic-heavy-dubstep-sytnth.wav", SampleType.Loop);
			mgr.add(1, 4, "skipyofficialmusic-heavy-dubstep-wobble.wav", SampleType.Loop);

			mgr.add(2, 1, "skipyofficialmusic-jump-up-synth.wav", SampleType.SinglePlay);
			mgr.add(2, 2, "skipyofficialmusic-skrillex-summit-lead.wav", SampleType.Loop);

			this.buttons = new ButtonBoard(mgr);

			mgr.loadSamples();

		}
	}
}