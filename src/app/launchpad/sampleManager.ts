module Launchpad {

	export interface ISampleManager { 
		progressCallback: (total: number, loaded: number) => any;

		add(row: number, column: number, filename: string, type: SampleType);
		get(row: number, column: number): Sample;
		
		loadSamples();
	}

	export class SampleManager implements ISampleManager {
		private samples:Sample[][];
		private basePath: string;
		private soundJsWrapper: ISoundJsWrapper;
		private samplesCount: number;
		private samplesLoaded: number;
		
		progressCallback: (total: number, loaded: number) => any;

		constructor(soundJsWrapper: ISoundJsWrapper, basePath: string) {				
			this.basePath = basePath;
			this.soundJsWrapper = soundJsWrapper;

			this.samples = new Array(8);
  			for (var i = 0; i < 8; i++) {
    			this.samples[i] = new Array(8);
  			}

  			this.soundJsWrapper.setSoundLoadedCallback((src: string) => this.soundLoadedHandler(src));  			
		}

		add(row: number, column: number, filename: string, type: SampleType) {
			this.samples[row][column] = new Sample(filename, type);	
		}

		get(row: number, column: number): Sample {
			return this.samples[row][column];
		}

		loadSamples() {

			var loadSounds = [];			
			this.samplesCount = 0;
			this.samplesLoaded = 0;
			this.forEachSample((sample: Sample) => {								
				loadSounds.push(sample.src);				
				this.samplesCount++;				
			});

			this.soundJsWrapper.loadSounds(loadSounds, this.basePath);			
		}

		private soundLoadedHandler(src: string) {
						
			this.forEachSample((sample: Sample) => {							
				if (sample.src != src) {
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

		private forEachSample(callback: (s: Sample) => any) {
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