module Launchpad {

	export interface ISampleManager { 
		progressCallback: (total: number, loaded: number) => any;

		add(row: number, column: number, filename: string, type: SampleType, barsCount: number);
		get(row: number, column: number): ISample;
		
		loadSamples();
	}

	export class SampleManager implements ISampleManager {
		private samples:ISample[][];
		private basePath: string;
		private soundJsWrapper: ISoundJsWrapper;
		private samplesCount: number;
		private samplesLoaded: number;
		private tempoSynchronizer: ITempoSynchronizer;
		private samplePlaySynchronizer: ISamplePlaySynchronizer;
		private metronome: IMetronome;
		
		progressCallback: (total: number, loaded: number) => any;

		constructor(soundJsWrapper: ISoundJsWrapper, 
					basePath: string, 
					tempoSynchronizer: ITempoSynchronizer, 
					samplePlaySynchronizer: ISamplePlaySynchronizer, 
					metronome: IMetronome) {				

			this.basePath = basePath;
			this.soundJsWrapper = soundJsWrapper;
			this.tempoSynchronizer = tempoSynchronizer;
			this.samplePlaySynchronizer = samplePlaySynchronizer;
			this.metronome = metronome;

			this.samples = new Array(8);
  			for (var i = 0; i < 8; i++) {
    			this.samples[i] = new Array(8);
  			}

  			for (var row = 0; row < 8; row++) {
				for (var col = 0; col < 8; col++) {
    				this.addSample(row, col, new EmptySample());
  				}    			
  			}

  			this.soundJsWrapper.setSoundLoadedCallback((src: string) => this.soundLoadedHandler(src));  			
		}

		add(row: number, column: number, filename: string, type: SampleType, barsCount: number) {
			var progress = new SampleProgress(barsCount, this.metronome);
			var sample = new Sample(filename, type, progress);
			progress.setSample(sample);
			this.addSample(row, column, sample);	
		}

		private addSample(row: number, column: number, sample: ISample) {
			this.samples[row][column] = new SynchronizedSample(sample, this.tempoSynchronizer);	
			this.samplePlaySynchronizer.set(row, column, sample);
		}

		get(row: number, column: number): ISample {
			return this.samples[row][column];
		}

		loadSamples() {

			var loadSounds = [];			
			this.samplesCount = 0;
			this.samplesLoaded = 0;
			this.forEachSample((sample: Sample) => {	
				var src = sample.src();
				if (src == null) {
					return;
				}							
				loadSounds.push(src);				
				this.samplesCount++;				
			});

			this.soundJsWrapper.loadSounds(loadSounds, this.basePath);			
		}

		private soundLoadedHandler(src: string) {
				
			this.forEachSample((sample: Sample) => {		

				if (this.basePath + sample.src() != src) {
					return;
				}

				var instance = this.soundJsWrapper.createSoundInstance(src);
				sample.setSoundInstance(instance);	
				this.samplesLoaded++;									
				if (this.progressCallback != undefined) {
					this.progressCallback(this.samplesCount, this.samplesLoaded);
				}				
			});						
		}

		private forEachSample(callback: (s: ISample) => any) {
			for (var row = 0; row < 8; row++) {
				for (var column = 0; column < 8; column++) {
					var sample = this.samples[row][column];
					if (sample != undefined) {
						callback(sample);		
					}			
				}
			}			
		}
	}
}