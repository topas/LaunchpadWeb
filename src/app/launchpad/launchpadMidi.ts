module Launchpad {

	export enum LaunchpadMidiButtonColor {
		Off, 
		Red,
		Amber,
		Green,
		Yellow, 
		RedFlashing,
		AmberFlashing,
		GreenFlashing,
		YellowFlashing
	}

	export interface ILaunchpadMidi {
		initialized(): ILiteEvent<ILaunchpadMidi, any>;
		buttonPressed(): ILiteEvent<ILaunchpadMidi, ButtonLocation>;

		setButton(location: ButtonLocation, color: LaunchpadMidiButtonColor);
	}

	export class LaunchpadMidi implements ILaunchpadMidi {
		private midiWrapper: IMidiApiWrapper;
		private onInitialized = new LiteEvent<ILaunchpadMidi, any>(); 
		private onButtonPressed = new LiteEvent<ILaunchpadMidi, ButtonLocation>(); 


		initialized(): ILiteEvent<ILaunchpadMidi, any> { return this.onInitialized; }
		buttonPressed(): ILiteEvent<ILaunchpadMidi, ButtonLocation> { return this.onButtonPressed; }

		constructor(midiWrapper: IMidiApiWrapper ) {
			this.midiWrapper = midiWrapper;

			this.midiWrapper.received().on((wrapper? :IMidiApiWrapper, message?: MidiMessage) => this.midiMessageReceived(message));
			this.midiWrapper.outputSet().on(() => this.initLaunchpad());
		}

		setButton(location: ButtonLocation, color: LaunchpadMidiButtonColor) {
			var note = (0x10 * location.row) + location.column;
			this.midiWrapper.send(new MidiMessage(0x90, note, this.getVelocity(color))); 
		}

		private initLaunchpad() {
			this.midiWrapper.send(new MidiMessage(0xB0, 0x00, 0x00)); // launchpad reset
			this.midiWrapper.send(new MidiMessage(0xB0, 0x00, 0x28)); // set flashing mode
			this.midiWrapper.send(new MidiMessage(0xB0, 0x6C, this.getVelocity(LaunchpadMidiButtonColor.Green))); // session button on

			this.onInitialized.trigger(this);
		}

		private midiMessageReceived(message: MidiMessage) {
			if (message.type != 0x90 || message.velocity != 0x7F) {
				return;
			}

			var row = Math.floor(message.note / 0x10);
			var column = message.note % 0x10;
			
			var location = new ButtonLocation(row, column);

			this.onButtonPressed.trigger(this, location);					
		}

		private getVelocity(buttonColor: LaunchpadMidiButtonColor): number {
			switch(buttonColor) {
				case LaunchpadMidiButtonColor.Off:
					return 0x0C;
				case LaunchpadMidiButtonColor.Red:
					return 0x0F;
				case LaunchpadMidiButtonColor.Amber:
					return 0x3F;
				case LaunchpadMidiButtonColor.Green:
					return 0x3C;
				case LaunchpadMidiButtonColor.Yellow:
					return 0x3E;
				case LaunchpadMidiButtonColor.RedFlashing:
					return 0x0B;
				case LaunchpadMidiButtonColor.AmberFlashing:
					return 0x3B;
				case LaunchpadMidiButtonColor.GreenFlashing:
					return 0x38;
				case LaunchpadMidiButtonColor.YellowFlashing:
					return 0x3A;
			}
		}
	}
}