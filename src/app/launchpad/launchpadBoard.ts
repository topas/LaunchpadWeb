module Launchpad {
	export class LaunchpadBoard {
		private onChanged = new LiteEvent<LaunchpadBoard, any>(); 
		private midiWrapper: IMidiApiWrapper;

		buttons: ButtonBoard;

		changed(): ILiteEvent<LaunchpadBoard, any> { return this.onChanged; }
		
		constructor(timeoutService: ng.ITimeoutService, midiWrapper: IMidiApiWrapper, progressCallback: (total: number, loaded: number) => any) {
			this.midiWrapper = midiWrapper;

			var soundJsWrapper = new SoundJsWrapper();			
			var launchpadMidi = new LaunchpadMidi(midiWrapper);
			var metronome = new Metronome(140, timeoutService)
			var tempoSynchronizer = new TempoSynchronizer(metronome);
			var samplePlaySynchronizer = new SamplePlaySynchronizer();
			var mgr = new SampleManager(soundJsWrapper, "./sounds/", tempoSynchronizer, samplePlaySynchronizer, metronome);
			mgr.progressCallback = progressCallback;

			mgr.add(0, 0, "skipyofficialmusic-drums1.wav", SampleType.Loop, 4);
			mgr.add(0, 1, "skyhunter-dubstep-dirty-wobble-bass.wav", SampleType.Loop, 4);

			mgr.add(0, 3, "skipyofficialmusic-dark-dubstep-loop.wav", SampleType.Loop, 4);
			mgr.add(1, 3, "skipyofficialmusic-heavy-dubstep-sytnth.wav", SampleType.Loop, 4);
			mgr.add(1, 4, "skipyofficialmusic-heavy-dubstep-wobble.wav", SampleType.Loop, 4);

			mgr.add(2, 1, "skipyofficialmusic-skrillex-summit-lead.wav", SampleType.Loop, 4);

			this.buttons = new ButtonBoard(mgr, samplePlaySynchronizer, launchpadMidi);
			this.buttons.buttonStateChanged().on(() => this.onChanged.trigger(this));

			mgr.loadSamples();
		}
	}
}