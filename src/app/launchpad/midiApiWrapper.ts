module Launchpad {

	export interface IMidiApiWrapper { 
		initOk(): ILiteEvent<IMidiApiWrapper, any>;
		initFailed(): ILiteEvent<IMidiApiWrapper, any>;

		getInputNames(): string[];
		setInputByName(name: string);
		getOutputNames(): string[];
		setOutputByName(name: string);

		send(message: MidiMessage);
		received() : ILiteEvent<IMidiApiWrapper, MidiMessage>;
	}

	export class MidiMessage {	
		constructor (public type: number, public note: number, public velocity: number) {}
	}

	interface IMidiWrapperState {
		getInputNames(): string[];
		setInputByName(name: string);
		getOutputNames(): string[];	
		setOutputByName(name: string);

		send(message: MidiMessage);
		received() : ILiteEvent<IMidiWrapperState, MidiMessage>;
	}

	class NotInitializedState implements IMidiWrapperState {
		getInputNames(): string[] {	
			return null;
		}

		setInputByName(name: string) {}

		getOutputNames(): string[] {
			return null;
		}		

		setOutputByName(name: string) { }
		send(message: MidiMessage) { }
		received() : ILiteEvent<IMidiWrapperState, MidiMessage> { return null; }
	}

	class InitilializedState implements IMidiWrapperState {
		private onReceived = new LiteEvent<IMidiWrapperState, MidiMessage>(); 
		private currentInput: any;
		private currentOutput: any;
		private inputs: any[]
		private outputs: any[];

		received() : ILiteEvent<IMidiWrapperState, MidiMessage> { return this.onReceived; }

		constructor(midiAccess: any) {
			this.currentInput = null;
			this.currentOutput = null;
			this.inputs = midiAccess.inputs();
			this.outputs = midiAccess.outputs();
		}

		getInputNames(): string[] {	
			return this.inputs.map(a => a.name);
		}

		setInputByName(name: string) {
			if (this.currentInput != null) {
				this.currentInput.onmidimessage = null;
			}
			
			var inputs = this.inputs.filter(a => a.name == name);
			if (inputs.length == 1) {
				this.currentInput = inputs[0];	
				this.currentInput.addEventListener("midimessage",  (message: any) => this.midiMessageReceived(message));
			}
			else {
				this.currentInput = null;
			}			
		}

		getOutputNames(): string[] {
			return this.outputs.map(a => a.name);
		}

		setOutputByName(name: string) { 	
			var outputs = this.outputs.filter(a => a.name == name);
			if (outputs.length == 1) {				
				this.currentOutput = outputs[0];											
			}
			else {
				this.currentOutput = null;
			} 
		}

		send(message: MidiMessage) {
			this.currentOutput.send([message.type, message.note, message.velocity]);
		}

		private midiMessageReceived(message: any) {
			if (message.data.length != 3) {
				return;
			}
			var m = new MidiMessage(message.data[0], message.data[1], message.data[2]);
			this.onReceived.trigger(this, m);
		}
	}

	export class MidiApiWrapper implements IMidiApiWrapper { 
		private onInitOk = new LiteEvent<IMidiApiWrapper, any>(); 
		private onInitFailed = new LiteEvent<IMidiApiWrapper, any>(); 
		private onReceived = new LiteEvent<IMidiApiWrapper, MidiMessage>(); 
		
		private state: IMidiWrapperState;
		
		initOk(): ILiteEvent<IMidiApiWrapper, any> { return this.onInitOk; }
		initFailed(): ILiteEvent<IMidiApiWrapper, any> { return this.onInitFailed; }
		received() : ILiteEvent<IMidiApiWrapper, MidiMessage> { return this.onReceived; }

		constructor() {
			this.state = new NotInitializedState();			
			(<any>window.navigator).requestMIDIAccess().then((midiAccess: any) => { this.initSuccessCallback(midiAccess) }, () => this.initFailureCallback() );
		}		

		getInputNames(): string[] {	
			return this.state.getInputNames();
		}

		setInputByName(name: string) {
			this.state.setInputByName(name);
		}

		getOutputNames(): string[] {
			return this.state.getOutputNames();
		}

		setOutputByName(name: string) {
			this.state.setOutputByName(name);
		}

		send(message: MidiMessage) {
			this.state.send(message);
		}

		private initSuccessCallback(midiAccess: any) {
			this.state = new InitilializedState(midiAccess);
			this.state.received().on((state?: IMidiWrapperState, message?: MidiMessage) => this.midiReceivedCallback(message));
			this.onInitOk.trigger(this);
		}	

		private initFailureCallback() {
			this.onInitFailed.trigger(this);
		}

		private midiReceivedCallback(message: MidiMessage) {
			this.onReceived.trigger(this, message);
		}
	}
}