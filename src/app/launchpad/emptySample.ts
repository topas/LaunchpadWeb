module Launchpad {

	export class EmptySample extends SampleBase {
		
		constructor() {
			super();
			this.setState(SampleState.None);
		}

		src() : string { 
			return null; 
		}

		type(): SampleType { return SampleType.Empty; }

		play() { 	
			this.setState(SampleState.Playing);
		}

		stop() {			
			this.setState(SampleState.None);
		}
	}

}