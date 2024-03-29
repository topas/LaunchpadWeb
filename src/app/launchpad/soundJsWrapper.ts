module Launchpad {

	export interface ISoundJsInstanceWrapper {
		completed(): ILiteEvent<ISoundJsInstanceWrapper, any>;

		play();
		loop();
		stop();
		setVolume(volume: number);
	}

	export class SoundJsInstanceWrapper implements ISoundJsInstanceWrapper {
		private instance: createjs.SoundInstance;
		private onCompleted = new LiteEvent<ISoundJsInstanceWrapper, any>(); 

		completed(): ILiteEvent<ISoundJsInstanceWrapper, any> { return this.onCompleted; }


		constructor(src: string) {
			this.instance = createjs.Sound.createInstance(src);
			this.instance.addEventListener("complete", createjs.proxy(this.completedHandler, this));
		}

		play() {
			this.instance.play();
		}

		loop() {
			this.instance.play(null, null, null, -1, null, null);
		}

		stop() {
			this.instance.stop();
		}

		setVolume(volume: number) {						
			this.instance.setVolume(volume / 100);
		}

		private completedHandler() {
			this.onCompleted.trigger(this);
		}
	}

	export class LoadCallback {
		constructor(public callback: (src: string) => any, public context: any) {}				
	}

	export interface ISoundJsWrapper {		
		setSoundLoadedCallback(callback: (src: string) => any);		
		loadSounds(items: string[], basePath: string);
		createSoundInstance(src: string): ISoundJsInstanceWrapper;
	}

	export class SoundJsWrapper implements ISoundJsWrapper {
		private soundLoadedCallback: (src: string) => any;		

		setSoundLoadedCallback(callback: (src: string) => any) {
			this.soundLoadedCallback = callback;
		}

		loadSounds(items: string[], basePath: string) {
			
			createjs.Sound.removeAllEventListeners();
			createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
			createjs.Sound.removeAllSounds();
			createjs.Sound.addEventListener("fileload", createjs.proxy(this.fileLoaded, this));			
			var manifest = [];
			for(var i in items) {
				var src = items[i];
				manifest.push({ src: src, id: i, preload: true });			
			}

			createjs.Sound.registerManifest(manifest, basePath);	
		}	

		createSoundInstance(src: string) : ISoundJsInstanceWrapper {
			return new SoundJsInstanceWrapper(src);
		}

		private fileLoaded(evt: any) {
			this.soundLoaded(evt.src);	
		}

		private soundLoaded(src: string) {
			if (this.soundLoadedCallback != undefined) {
				this.soundLoadedCallback(src);
			}
		}
	}
}