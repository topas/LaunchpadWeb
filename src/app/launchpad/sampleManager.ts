module Launchpad {

	export interface ISampleManager { 
		add(row: number, column: number, filename: string, type: SampleType);
		get(row: number, column: number): Sample;
		loadSamples();
	}

	export class SampleManager implements ISampleManager {
		private samples:Sample[][];
		private basePath: string;

		constructor(basePath: string) {				
			this.basePath = basePath;

			this.samples = new Array(8);
  			for (var i = 0; i < 8; i++) {
    			this.samples[i] = new Array(8);
  			}
		}

		add(row: number, column: number, filename: string, type: SampleType) {
			this.samples[row][column] = new Sample(filename, type);	
		}

		get(row: number, column: number): Sample {
			return this.samples[row][column];
		}

		loadSamples() {
			createjs.Sound.addEventListener("fileload", createjs.proxy(this.loadHandlerProxy, this));

			var manifest = [];
			var id = 0;
			for (var row = 0; row < 8; row++) {
				for (var column = 0; column < 8; column++) {
					var sample = this.samples[row][column];
					if (sample != undefined) {
						manifest.push({ src: sample.src, id: id++ });
					}
				}
			}					

			createjs.Sound.registerManifest(manifest, this.basePath);
		}

		private loadHandlerProxy() {

			for (var row = 0; row < 8; row++) {
				for (var column = 0; column < 8; column++) {
					var sample = this.samples[row][column];
					if (sample != undefined) {
						var instance = createjs.Sound.createInstance(sample.src);
						sample.setSoundInstance(instance);
						// sample.play();
					}
				}
			}				
		}
	}
}