var Launchpad;
(function (Launchpad) {
    var SampleBase = (function () {
        function SampleBase() {
            this.onStateChanged = new LiteEvent();
            this.state = Launchpad.SampleState.None;
        }
        SampleBase.prototype.stateChanged = function () {
            return this.onStateChanged;
        };

        SampleBase.prototype.type = function () {
            throw "Abstract method";
        };
        SampleBase.prototype.setSoundInstance = function (instance) {
            throw "Abstract method";
        };
        SampleBase.prototype.src = function () {
            throw "Abstract method";
        };
        SampleBase.prototype.play = function () {
            throw "Abstract method";
        };
        SampleBase.prototype.stop = function () {
            throw "Abstract method";
        };
        SampleBase.prototype.setVolume = function (volume) {
            throw "Abstract method";
        };

        SampleBase.prototype.setState = function (state) {
            this.state = state;
            this.onStateChanged.trigger(this, state);
        };
        return SampleBase;
    })();
    Launchpad.SampleBase = SampleBase;
})(Launchpad || (Launchpad = {}));
var LiteEvent = (function () {
    function LiteEvent() {
        this.handlers = [];
    }
    LiteEvent.prototype.on = function (handler) {
        this.handlers.push(handler);
    };

    LiteEvent.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) {
            return h !== handler;
        });
    };

    LiteEvent.prototype.trigger = function (sender, data) {
        if (this.handlers) {
            this.handlers.forEach(function (h) {
                return h(sender, data);
            });
        }
    };
    return LiteEvent;
})();
var Launchpad;
(function (Launchpad) {
    var Button = (function () {
        function Button(row, column, sample) {
            var _this = this;
            this.onStateChanged = new LiteEvent();
            this.row = row;
            this.column = column;
            this.location = new Launchpad.ButtonLocation(row.index, column.index);
            this.state = Launchpad.ButtonState.Disabled;
            this.sample = sample;

            this.sample.stateChanged().on(function (sample, state) {
                return _this.sampleStateChanged(state);
            });
        }
        Button.prototype.stateChanged = function () {
            return this.onStateChanged;
        };

        Button.prototype.click = function () {
            this.sample.play();
        };

        Button.prototype.sampleStateChanged = function (state) {
            switch (state) {
                case Launchpad.SampleState.None:
                    this.changeState(Launchpad.ButtonState.Disabled);
                    break;
                case Launchpad.SampleState.Waiting:
                    this.changeState(Launchpad.ButtonState.Waiting);
                    break;
                case Launchpad.SampleState.Stopped:
                    this.changeState(Launchpad.ButtonState.SampleLoaded);
                    break;
                case Launchpad.SampleState.Loaded:
                    this.changeState(Launchpad.ButtonState.SampleLoaded);
                    break;
                case Launchpad.SampleState.Playing:
                    this.changeState(Launchpad.ButtonState.Playing);
                    break;
            }
        };

        Button.prototype.changeState = function (state) {
            this.state = state;
            this.onStateChanged.trigger(this, this.state);
        };
        return Button;
    })();
    Launchpad.Button = Button;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonBoard = (function () {
        function ButtonBoard(sampleManager, samplePlaySynchronizer, lauchpadMidi) {
            var _this = this;
            this.onButtonStateChanged = new LiteEvent();
            this.lauchpadMidi = lauchpadMidi;
            this.lauchpadMidi.initialized().on(function () {
                return _this.midiInitialized();
            });
            this.lauchpadMidi.buttonPressed().on(function (lauchpadMidi, location) {
                return _this.midiButtonPressed(location);
            });

            this.columns = [];
            for (var column = 0; column < 8; column++) {
                this.columns.push(new Launchpad.ButtonColumn(column, samplePlaySynchronizer.getColumn(column)));
            }

            this.rows = [];
            for (var row = 0; row < 8; row++) {
                var buttonRow = new Launchpad.ButtonRow(row, samplePlaySynchronizer.getRow(row), this.columns, sampleManager);
                buttonRow.buttonStateChanged().on(function (button, state) {
                    return _this.updateButtonState(button, state);
                });
                this.rows.push(buttonRow);
            }
        }
        ButtonBoard.prototype.buttonStateChanged = function () {
            return this.onButtonStateChanged;
        };

        ButtonBoard.prototype.midiButtonPressed = function (location) {
            if (location.row >= 0 && location.row < 8 && location.column >= 0 && location.column < 8) {
                this.rows[location.row].buttons[location.column].click();
            }
        };

        ButtonBoard.prototype.midiInitialized = function () {
            for (var row = 0; row < 8; row++) {
                for (var column = 0; column < 8; column++) {
                    var button = this.rows[row].buttons[column];
                    this.updateButtonState(button, button.state);
                }
            }
        };

        ButtonBoard.prototype.updateButtonState = function (button, state) {
            this.onButtonStateChanged.trigger(button, state);
            switch (button.state) {
                case Launchpad.ButtonState.Disabled:
                    this.lauchpadMidi.setButton(button.location, Launchpad.LaunchpadMidiButtonColor.Off);
                    break;
                case Launchpad.ButtonState.SampleLoaded:
                    this.lauchpadMidi.setButton(button.location, Launchpad.LaunchpadMidiButtonColor.Yellow);
                    break;
                case Launchpad.ButtonState.Waiting:
                    this.lauchpadMidi.setButton(button.location, Launchpad.LaunchpadMidiButtonColor.GreenFlashing);
                    break;
                case Launchpad.ButtonState.Playing:
                    this.lauchpadMidi.setButton(button.location, Launchpad.LaunchpadMidiButtonColor.Green);
                    break;
            }
        };
        return ButtonBoard;
    })();
    Launchpad.ButtonBoard = ButtonBoard;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonColumn = (function () {
        function ButtonColumn(columnIndex, sampleColumn) {
            this.index = columnIndex;
            this.sampleColumn = sampleColumn;
            this.buttons = [];
            this.volume = 90;
            this.volumeChanged();
        }
        ButtonColumn.prototype.addButton = function (button) {
            this.buttons.push(button);
        };

        ButtonColumn.prototype.stop = function () {
            this.sampleColumn.stop();
        };

        ButtonColumn.prototype.volumeChanged = function () {
            this.sampleColumn.setVolume(this.volume);
        };
        return ButtonColumn;
    })();
    Launchpad.ButtonColumn = ButtonColumn;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonLocation = (function () {
        function ButtonLocation(row, column) {
            this.row = row;
            this.column = column;
        }
        return ButtonLocation;
    })();
    Launchpad.ButtonLocation = ButtonLocation;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonRow = (function () {
        function ButtonRow(rowIndex, sampleRow, columns, sampleManager) {
            var _this = this;
            this.onButtonStateChanged = new LiteEvent();
            this.index = rowIndex;
            this.state = Launchpad.ButtonState.Disabled;
            this.buttons = [];
            this.sampleManager = sampleManager;
            this.sampleRow = sampleRow;

            for (var columnIndex = 0; columnIndex < 8; columnIndex++) {
                var sample = this.sampleManager.get(rowIndex, columnIndex);
                var column = columns[columnIndex];
                var button = new Launchpad.Button(this, column, sample);
                button.stateChanged().on(function (button, state) {
                    return _this.onButtonStateChanged.trigger(button, state);
                });
                column.addButton(button);
                this.addButton(button);
            }
        }
        ButtonRow.prototype.buttonStateChanged = function () {
            return this.onButtonStateChanged;
        };

        ButtonRow.prototype.addButton = function (button) {
            this.buttons.push(button);
        };
        return ButtonRow;
    })();
    Launchpad.ButtonRow = ButtonRow;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    (function (ButtonState) {
        ButtonState[ButtonState["Disabled"] = "Disabled"] = "Disabled";
        ButtonState[ButtonState["SampleLoaded"] = "SampleLoaded"] = "SampleLoaded";
        ButtonState[ButtonState["Waiting"] = "Waiting"] = "Waiting";
        ButtonState[ButtonState["Playing"] = "Playing"] = "Playing";
    })(Launchpad.ButtonState || (Launchpad.ButtonState = {}));
    var ButtonState = Launchpad.ButtonState;
})(Launchpad || (Launchpad = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Launchpad;
(function (Launchpad) {
    var EmptySample = (function (_super) {
        __extends(EmptySample, _super);
        function EmptySample() {
            _super.call(this);
            this.setState(Launchpad.SampleState.None);
        }
        EmptySample.prototype.src = function () {
            return null;
        };

        EmptySample.prototype.type = function () {
            return Launchpad.SampleType.Empty;
        };

        EmptySample.prototype.play = function () {
            this.setState(Launchpad.SampleState.Playing);
        };

        EmptySample.prototype.stop = function () {
            this.setState(Launchpad.SampleState.None);
        };

        EmptySample.prototype.setVolume = function (volume) {
        };
        return EmptySample;
    })(Launchpad.SampleBase);
    Launchpad.EmptySample = EmptySample;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var LaunchpadBoard = (function () {
        function LaunchpadBoard(timeoutService, midiWrapper, progressCallback) {
            var _this = this;
            this.onChanged = new LiteEvent();
            this.midiWrapper = midiWrapper;

            var soundJsWrapper = new Launchpad.SoundJsWrapper();
            var launchpadMidi = new Launchpad.LaunchpadMidi(midiWrapper);
            var tempoSynchronizer = new Launchpad.TempoSynchronizer(140, timeoutService);
            var samplePlaySynchronizer = new Launchpad.SamplePlaySynchronizer();
            var mgr = new Launchpad.SampleManager(soundJsWrapper, "./sounds/", tempoSynchronizer, samplePlaySynchronizer);
            mgr.progressCallback = progressCallback;

            mgr.add(0, 0, "skipyofficialmusic-drums1.wav", Launchpad.SampleType.Loop);
            mgr.add(0, 1, "skyhunter-dubstep-dirty-wobble-bass.wav", Launchpad.SampleType.Loop);

            mgr.add(0, 3, "skipyofficialmusic-dark-dubstep-loop.wav", Launchpad.SampleType.Loop);
            mgr.add(1, 3, "skipyofficialmusic-heavy-dubstep-sytnth.wav", Launchpad.SampleType.Loop);
            mgr.add(1, 4, "skipyofficialmusic-heavy-dubstep-wobble.wav", Launchpad.SampleType.Loop);

            mgr.add(2, 1, "skipyofficialmusic-skrillex-summit-lead.wav", Launchpad.SampleType.Loop);

            this.buttons = new Launchpad.ButtonBoard(mgr, samplePlaySynchronizer, launchpadMidi);
            this.buttons.buttonStateChanged().on(function () {
                return _this.onChanged.trigger(_this);
            });

            mgr.loadSamples();
        }
        LaunchpadBoard.prototype.changed = function () {
            return this.onChanged;
        };
        return LaunchpadBoard;
    })();
    Launchpad.LaunchpadBoard = LaunchpadBoard;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    (function (LaunchpadMidiButtonColor) {
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["Off"] = 0] = "Off";
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["Red"] = 1] = "Red";
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["Amber"] = 2] = "Amber";
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["Green"] = 3] = "Green";
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["Yellow"] = 4] = "Yellow";
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["RedFlashing"] = 5] = "RedFlashing";
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["AmberFlashing"] = 6] = "AmberFlashing";
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["GreenFlashing"] = 7] = "GreenFlashing";
        LaunchpadMidiButtonColor[LaunchpadMidiButtonColor["YellowFlashing"] = 8] = "YellowFlashing";
    })(Launchpad.LaunchpadMidiButtonColor || (Launchpad.LaunchpadMidiButtonColor = {}));
    var LaunchpadMidiButtonColor = Launchpad.LaunchpadMidiButtonColor;

    var LaunchpadMidi = (function () {
        function LaunchpadMidi(midiWrapper) {
            var _this = this;
            this.onInitialized = new LiteEvent();
            this.onButtonPressed = new LiteEvent();
            this.midiWrapper = midiWrapper;

            this.midiWrapper.received().on(function (wrapper, message) {
                return _this.midiMessageReceived(message);
            });
            this.midiWrapper.outputSet().on(function () {
                return _this.initLaunchpad();
            });
        }
        LaunchpadMidi.prototype.initialized = function () {
            return this.onInitialized;
        };
        LaunchpadMidi.prototype.buttonPressed = function () {
            return this.onButtonPressed;
        };

        LaunchpadMidi.prototype.setButton = function (location, color) {
            var note = (0x10 * location.row) + location.column;
            this.midiWrapper.send(new Launchpad.MidiMessage(0x90, note, this.getVelocity(color)));
        };

        LaunchpadMidi.prototype.initLaunchpad = function () {
            this.midiWrapper.send(new Launchpad.MidiMessage(0xB0, 0x00, 0x00));
            this.midiWrapper.send(new Launchpad.MidiMessage(0xB0, 0x00, 0x28));
            this.midiWrapper.send(new Launchpad.MidiMessage(0xB0, 0x6C, this.getVelocity(LaunchpadMidiButtonColor.Green)));

            this.onInitialized.trigger(this);
        };

        LaunchpadMidi.prototype.midiMessageReceived = function (message) {
            if (message.type != 0x90 || message.velocity != 0x7F) {
                return;
            }

            var row = Math.floor(message.note / 0x10);
            var column = message.note % 0x10;

            var location = new Launchpad.ButtonLocation(row, column);

            this.onButtonPressed.trigger(this, location);
        };

        LaunchpadMidi.prototype.getVelocity = function (buttonColor) {
            switch (buttonColor) {
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
        };
        return LaunchpadMidi;
    })();
    Launchpad.LaunchpadMidi = LaunchpadMidi;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var MidiMessage = (function () {
        function MidiMessage(type, note, velocity) {
            this.type = type;
            this.note = note;
            this.velocity = velocity;
        }
        return MidiMessage;
    })();
    Launchpad.MidiMessage = MidiMessage;

    var NotInitializedState = (function () {
        function NotInitializedState() {
        }
        NotInitializedState.prototype.inputSet = function () {
            return null;
        };
        NotInitializedState.prototype.outputSet = function () {
            return null;
        };

        NotInitializedState.prototype.getInputNames = function () {
            return null;
        };

        NotInitializedState.prototype.setInputByName = function (name) {
        };

        NotInitializedState.prototype.getOutputNames = function () {
            return null;
        };

        NotInitializedState.prototype.setOutputByName = function (name) {
        };
        NotInitializedState.prototype.send = function (message) {
        };
        NotInitializedState.prototype.received = function () {
            return null;
        };
        return NotInitializedState;
    })();

    var InitilializedState = (function () {
        function InitilializedState(midiAccess) {
            var _this = this;
            this.onReceived = new LiteEvent();
            this.onInputSet = new LiteEvent();
            this.onOutputSet = new LiteEvent();
            this.midiReceivedProxy = function (message) {
                return _this.midiMessageReceived(message);
            };
            this.currentInput = null;
            this.currentOutput = null;
            this.inputs = midiAccess.inputs();
            this.outputs = midiAccess.outputs();
        }
        InitilializedState.prototype.inputSet = function () {
            return this.onInputSet;
        };
        InitilializedState.prototype.outputSet = function () {
            return this.onOutputSet;
        };
        InitilializedState.prototype.received = function () {
            return this.onReceived;
        };

        InitilializedState.prototype.getInputNames = function () {
            return this.inputs.map(function (a) {
                return a.name;
            });
        };

        InitilializedState.prototype.setInputByName = function (name) {
            if (this.currentInput != null) {
                this.currentInput.removeEventListener("midimessage", this.midiReceivedProxy);
            }

            var inputs = this.inputs.filter(function (a) {
                return a.name == name;
            });
            if (inputs.length == 1) {
                this.currentInput = inputs[0];
                this.currentInput.addEventListener("midimessage", this.midiReceivedProxy);
                this.onInputSet.trigger(this);
            } else {
                this.currentInput = null;
            }
        };

        InitilializedState.prototype.getOutputNames = function () {
            return this.outputs.map(function (a) {
                return a.name;
            });
        };

        InitilializedState.prototype.setOutputByName = function (name) {
            var outputs = this.outputs.filter(function (a) {
                return a.name == name;
            });
            if (outputs.length == 1) {
                this.currentOutput = outputs[0];
                this.onOutputSet.trigger(this);
            } else {
                this.currentOutput = null;
            }
        };

        InitilializedState.prototype.send = function (message) {
            if (this.currentOutput == null) {
                return;
            }
            this.currentOutput.send([message.type, message.note, message.velocity]);
        };

        InitilializedState.prototype.midiMessageReceived = function (message) {
            if (message.data.length != 3) {
                return;
            }
            var m = new MidiMessage(message.data[0], message.data[1], message.data[2]);
            this.onReceived.trigger(this, m);
        };
        return InitilializedState;
    })();

    var MidiApiWrapper = (function () {
        function MidiApiWrapper() {
            var _this = this;
            this.onInitOk = new LiteEvent();
            this.onInitFailed = new LiteEvent();
            this.onInputSet = new LiteEvent();
            this.onOutputSet = new LiteEvent();
            this.onReceived = new LiteEvent();
            this.state = new NotInitializedState();
            (window.navigator).requestMIDIAccess().then(function (midiAccess) {
                _this.initSuccessCallback(midiAccess);
            }, function () {
                return _this.initFailureCallback();
            });
        }
        MidiApiWrapper.prototype.initOk = function () {
            return this.onInitOk;
        };
        MidiApiWrapper.prototype.initFailed = function () {
            return this.onInitFailed;
        };
        MidiApiWrapper.prototype.inputSet = function () {
            return this.onInputSet;
        };
        MidiApiWrapper.prototype.outputSet = function () {
            return this.onOutputSet;
        };
        MidiApiWrapper.prototype.received = function () {
            return this.onReceived;
        };

        MidiApiWrapper.prototype.getInputNames = function () {
            return this.state.getInputNames();
        };

        MidiApiWrapper.prototype.setInputByName = function (name) {
            this.state.setInputByName(name);
        };

        MidiApiWrapper.prototype.getOutputNames = function () {
            return this.state.getOutputNames();
        };

        MidiApiWrapper.prototype.setOutputByName = function (name) {
            this.state.setOutputByName(name);
        };

        MidiApiWrapper.prototype.send = function (message) {
            this.state.send(message);
        };

        MidiApiWrapper.prototype.initSuccessCallback = function (midiAccess) {
            var _this = this;
            this.state = new InitilializedState(midiAccess);
            this.state.received().on(function (state, message) {
                return _this.onReceived.trigger(_this, message);
            });
            this.state.inputSet().on(function (state, dummy) {
                return _this.onInputSet.trigger(_this);
            });
            this.state.outputSet().on(function (state, dummy) {
                return _this.onOutputSet.trigger(_this);
            });
            this.onInitOk.trigger(this);
        };

        MidiApiWrapper.prototype.initFailureCallback = function () {
            this.onInitFailed.trigger(this);
        };
        return MidiApiWrapper;
    })();
    Launchpad.MidiApiWrapper = MidiApiWrapper;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var Sample = (function (_super) {
        __extends(Sample, _super);
        function Sample(src, sampleType) {
            _super.call(this);
            this.srcPath = src;
            this.sampleType = sampleType;
        }
        Sample.prototype.type = function () {
            return this.sampleType;
        };

        Sample.prototype.setSoundInstance = function (instance) {
            var _this = this;
            this.instance = instance;
            this.setState(Launchpad.SampleState.Loaded);
            this.updateVolume();
            this.instance.completed().on(function () {
                return _this.sampleCompleted();
            });
        };

        Sample.prototype.src = function () {
            return this.srcPath;
        };

        Sample.prototype.play = function () {
            if (this.sampleType == Launchpad.SampleType.Loop) {
                this.instance.loop();
            } else {
                this.instance.play();
            }

            this.setState(Launchpad.SampleState.Playing);
        };

        Sample.prototype.stop = function () {
            this.instance.stop();
            this.setState(Launchpad.SampleState.Stopped);
        };

        Sample.prototype.setVolume = function (volume) {
            this.volume = volume;
            this.updateVolume();
        };

        Sample.prototype.updateVolume = function () {
            if (this.instance != null) {
                this.instance.setVolume(this.volume);
            }
        };

        Sample.prototype.sampleCompleted = function () {
            this.setState(Launchpad.SampleState.Stopped);
        };
        return Sample;
    })(Launchpad.SampleBase);
    Launchpad.Sample = Sample;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var SampleColumn = (function () {
        function SampleColumn(index) {
            this.index = index;
            this.samples = [];
        }
        SampleColumn.prototype.setSample = function (index, sample) {
            var _this = this;
            this.samples[index] = sample;
            sample.stateChanged().on(function (sample, state) {
                return _this.sampleStateChanged(sample, state);
            });
        };

        SampleColumn.prototype.stop = function () {
            this.samples.forEach(function (s) {
                return s.stop();
            });
        };

        SampleColumn.prototype.setVolume = function (volume) {
            this.samples.forEach(function (s) {
                return s.setVolume(volume);
            });
        };

        SampleColumn.prototype.sampleStateChanged = function (sample, state) {
            if (state == Launchpad.SampleState.Playing) {
                var samplesToStop = this.samples.filter(function (s) {
                    return s !== sample;
                });
                if (sample.type() == Launchpad.SampleType.Empty) {
                    samplesToStop = this.samples;
                }

                samplesToStop.forEach(function (s) {
                    return s.stop();
                });
            }
        };
        return SampleColumn;
    })();
    Launchpad.SampleColumn = SampleColumn;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var SampleManager = (function () {
        function SampleManager(soundJsWrapper, basePath, tempoSynchronizer, samplePlaySynchronizer) {
            var _this = this;
            this.basePath = basePath;
            this.soundJsWrapper = soundJsWrapper;
            this.tempoSynchronizer = tempoSynchronizer;
            this.samplePlaySynchronizer = samplePlaySynchronizer;

            this.samples = new Array(8);
            for (var i = 0; i < 8; i++) {
                this.samples[i] = new Array(8);
            }

            for (var row = 0; row < 8; row++) {
                for (var col = 0; col < 8; col++) {
                    this.addSample(row, col, new Launchpad.EmptySample());
                }
            }

            this.soundJsWrapper.setSoundLoadedCallback(function (src) {
                return _this.soundLoadedHandler(src);
            });
        }
        SampleManager.prototype.add = function (row, column, filename, type) {
            this.addSample(row, column, new Launchpad.Sample(filename, type));
        };

        SampleManager.prototype.addSample = function (row, column, sample) {
            this.samples[row][column] = new Launchpad.SynchronizedSample(sample, this.tempoSynchronizer);
            this.samplePlaySynchronizer.set(row, column, sample);
        };

        SampleManager.prototype.get = function (row, column) {
            return this.samples[row][column];
        };

        SampleManager.prototype.loadSamples = function () {
            var _this = this;
            var loadSounds = [];
            this.samplesCount = 0;
            this.samplesLoaded = 0;
            this.forEachSample(function (sample) {
                var src = sample.src();
                if (src == null) {
                    return;
                }
                loadSounds.push(src);
                _this.samplesCount++;
            });

            this.soundJsWrapper.loadSounds(loadSounds, this.basePath);
        };

        SampleManager.prototype.soundLoadedHandler = function (src) {
            var _this = this;
            this.forEachSample(function (sample) {
                if (sample.src() != src) {
                    return;
                }

                var instance = _this.soundJsWrapper.createSoundInstance(src);
                sample.setSoundInstance(instance);
                _this.samplesLoaded++;
                if (_this.progressCallback != undefined) {
                    _this.progressCallback(_this.samplesCount, _this.samplesLoaded);
                }
            });
        };

        SampleManager.prototype.forEachSample = function (callback) {
            for (var row = 0; row < 8; row++) {
                for (var column = 0; column < 8; column++) {
                    var sample = this.samples[row][column];
                    if (sample != undefined) {
                        callback(sample);
                    }
                }
            }
        };
        return SampleManager;
    })();
    Launchpad.SampleManager = SampleManager;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var SamplePlaySynchronizer = (function () {
        function SamplePlaySynchronizer() {
            this.columns = [];
            for (var column = 0; column < 8; column++) {
                this.columns.push(new Launchpad.SampleColumn(column));
            }

            this.rows = [];
            for (var row = 0; row < 8; row++) {
                this.rows.push(new Launchpad.SampleRow(row));
            }
        }
        SamplePlaySynchronizer.prototype.set = function (row, column, sample) {
            this.columns[column].setSample(row, sample);
            this.rows[row].setSample(column, sample);
        };

        SamplePlaySynchronizer.prototype.getRow = function (index) {
            return this.rows[index];
        };

        SamplePlaySynchronizer.prototype.getColumn = function (index) {
            return this.columns[index];
        };
        return SamplePlaySynchronizer;
    })();
    Launchpad.SamplePlaySynchronizer = SamplePlaySynchronizer;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var SampleRow = (function () {
        function SampleRow(index) {
            this.index = index;
            this.samples = [];
        }
        SampleRow.prototype.setSample = function (index, sample) {
            this.samples[index] = sample;
        };
        return SampleRow;
    })();
    Launchpad.SampleRow = SampleRow;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    (function (SampleState) {
        SampleState[SampleState["None"] = "None"] = "None";
        SampleState[SampleState["Loaded"] = "Loaded"] = "Loaded";
        SampleState[SampleState["Playing"] = "Playing"] = "Playing";
        SampleState[SampleState["Stopped"] = "Stopped"] = "Stopped";
        SampleState[SampleState["Waiting"] = "Waiting"] = "Waiting";
    })(Launchpad.SampleState || (Launchpad.SampleState = {}));
    var SampleState = Launchpad.SampleState;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    (function (SampleType) {
        SampleType[SampleType["Empty"] = "Empty"] = "Empty";
        SampleType[SampleType["SinglePlay"] = "SinglePlay"] = "SinglePlay";
        SampleType[SampleType["Loop"] = "Loop"] = "Loop";
    })(Launchpad.SampleType || (Launchpad.SampleType = {}));
    var SampleType = Launchpad.SampleType;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var SoundJsInstanceWrapper = (function () {
        function SoundJsInstanceWrapper(src) {
            this.onCompleted = new LiteEvent();
            this.instance = createjs.Sound.createInstance(src);
            this.instance.addEventListener("complete", createjs.proxy(this.completedHandler, this));
        }
        SoundJsInstanceWrapper.prototype.completed = function () {
            return this.onCompleted;
        };

        SoundJsInstanceWrapper.prototype.play = function () {
            this.instance.play();
        };

        SoundJsInstanceWrapper.prototype.loop = function () {
            this.instance.play(null, null, null, -1, null, null);
        };

        SoundJsInstanceWrapper.prototype.stop = function () {
            this.instance.stop();
        };

        SoundJsInstanceWrapper.prototype.setVolume = function (volume) {
            this.instance.setVolume(volume / 100);
        };

        SoundJsInstanceWrapper.prototype.completedHandler = function () {
            this.onCompleted.trigger(this);
        };
        return SoundJsInstanceWrapper;
    })();
    Launchpad.SoundJsInstanceWrapper = SoundJsInstanceWrapper;

    var LoadCallback = (function () {
        function LoadCallback(callback, context) {
            this.callback = callback;
            this.context = context;
        }
        return LoadCallback;
    })();
    Launchpad.LoadCallback = LoadCallback;

    var SoundJsWrapper = (function () {
        function SoundJsWrapper() {
        }
        SoundJsWrapper.prototype.setSoundLoadedCallback = function (callback) {
            this.soundLoadedCallback = callback;
        };

        SoundJsWrapper.prototype.loadSounds = function (items, basePath) {
            createjs.Sound.addEventListener("fileload", createjs.proxy(this.fileLoaded, this));
            var manifest = [];
            for (var i in items) {
                var src = items[i];
                manifest.push({ src: src, id: i, preload: true });
            }

            createjs.Sound.registerManifest(manifest, basePath);
        };

        SoundJsWrapper.prototype.createSoundInstance = function (src) {
            return new SoundJsInstanceWrapper(src);
        };

        SoundJsWrapper.prototype.fileLoaded = function (evt) {
            if (this.soundLoadedCallback != undefined) {
                this.soundLoadedCallback(evt.src);
            }
        };
        return SoundJsWrapper;
    })();
    Launchpad.SoundJsWrapper = SoundJsWrapper;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var SynchronizedSample = (function (_super) {
        __extends(SynchronizedSample, _super);
        function SynchronizedSample(sample, tempoSynchronizer) {
            var _this = this;
            _super.call(this);
            this.sample = sample;
            this.tempoSynchronizer = tempoSynchronizer;
            this.sample.stateChanged().on(function (sample, state) {
                return _this.internalSampleStateChanged(sample, state);
            });
        }
        SynchronizedSample.prototype.type = function () {
            return this.sample.type();
        };

        SynchronizedSample.prototype.src = function () {
            return this.sample.src();
        };

        SynchronizedSample.prototype.setSoundInstance = function (instance) {
            this.sample.setSoundInstance(instance);
        };

        SynchronizedSample.prototype.play = function () {
            this.setState(Launchpad.SampleState.Waiting);
            this.tempoSynchronizer.play(this.sample);
        };

        SynchronizedSample.prototype.stop = function () {
            this.setState(Launchpad.SampleState.Waiting);
            this.tempoSynchronizer.stop(this.sample);
        };

        SynchronizedSample.prototype.internalSampleStateChanged = function (sample, state) {
            this.setState(state);
        };
        return SynchronizedSample;
    })(Launchpad.SampleBase);
    Launchpad.SynchronizedSample = SynchronizedSample;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var TempoSynchronizer = (function () {
        function TempoSynchronizer(bpm, timeoutService) {
            this.timeoutService = timeoutService;
            this.tempoDelay = this.getDelayByBpm(bpm);
            this.playSampleQueue = [];
            this.stopSampleQueue = [];

            this.setProcessInterval();
        }
        TempoSynchronizer.prototype.play = function (sample) {
            this.playSampleQueue.push(sample);
        };

        TempoSynchronizer.prototype.stop = function (sample) {
            this.stopSampleQueue.push(sample);
        };

        TempoSynchronizer.prototype.processSampleQueue = function () {
            while (this.stopSampleQueue.length > 0) {
                var sample = this.stopSampleQueue.shift();
                var index = this.playSampleQueue.indexOf(sample);
                this.playSampleQueue.splice(index, 1);
                sample.stop();
            }

            while (this.playSampleQueue.length > 0) {
                var sample = this.playSampleQueue.shift();
                sample.play();
            }
            this.setProcessInterval();
        };

        TempoSynchronizer.prototype.setProcessInterval = function () {
            var _this = this;
            this.timeoutService(function () {
                return _this.processSampleQueue();
            }, this.tempoDelay);
        };

        TempoSynchronizer.prototype.getDelayByBpm = function (bpm) {
            var minute = 1000 * 60;
            return (minute / bpm) * 4 * 4;
        };
        return TempoSynchronizer;
    })();
    Launchpad.TempoSynchronizer = TempoSynchronizer;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var PlayCtrl = (function () {
        function PlayCtrl($scope, $timeout) {
            var _this = this;
            this.midiWrapper = new Launchpad.MidiApiWrapper();
            this.midiWrapper.initOk().on(function (midiWrapper, dummy) {
                return _this.setMidiInputsAndOutputs($scope, midiWrapper);
            });
            this.midiWrapper.initFailed().on(function () {
                $scope.midiError = true;
            });

            $scope.progress = 0;
            $scope.board = new Launchpad.LaunchpadBoard($timeout, this.midiWrapper, function (total, loaded) {
                _this.updateProgress($scope, total, loaded);
            });
            $scope.board.changed().on(function () {
                return _this.lauchpadBoardChanged($scope);
            });
            $scope.isSampleLoaded = function (button) {
                return _this.isSampleLoaded(button);
            };
            $scope.midiSettingChanged = function () {
                return _this.midiSettingChanged($scope);
            };
        }
        PlayCtrl.prototype.isSampleLoaded = function (button) {
            return button.state == Launchpad.ButtonState.SampleLoaded || button.state == Launchpad.ButtonState.Playing || button.state == Launchpad.ButtonState.Waiting;
        };

        PlayCtrl.prototype.updateProgress = function ($scope, total, loaded) {
            $scope.$apply(function () {
                $scope.progress = (loaded / total) * 100;
            });
        };

        PlayCtrl.prototype.setMidiInputsAndOutputs = function ($scope, midiWrapper) {
            $scope.midiInputs = midiWrapper.getInputNames();
            $scope.midiOutputs = midiWrapper.getOutputNames();

            $scope.midiInput = $scope.midiInputs.filter(function (a) {
                return a == "Launchpad";
            })[0];
            $scope.midiOutput = $scope.midiOutputs.filter(function (a) {
                return a == "Launchpad";
            })[0];
            if ($scope.midiInput && $scope.midiOutput) {
                this.midiSettingChanged($scope);
            }
        };

        PlayCtrl.prototype.midiSettingChanged = function ($scope) {
            this.midiWrapper.setInputByName($scope.midiInput);
            this.midiWrapper.setOutputByName($scope.midiOutput);
        };

        PlayCtrl.prototype.lauchpadBoardChanged = function ($scope) {
            setTimeout(function () {
                $scope.$apply();
            }, 1);
        };
        return PlayCtrl;
    })();
    Launchpad.PlayCtrl = PlayCtrl;
})(Launchpad || (Launchpad = {}));
var launchpadApp = angular.module('launchpadApp', ['$strap.directives']).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/play', { templateUrl: 'play.html' }).when('/about', { templateUrl: 'about.html' }).otherwise({ redirectTo: '/play' });
    }
]);

launchpadApp.directive('slider', function () {
    return {
        require: "ngModel",
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (modelValue) {
                if (modelValue == undefined) {
                    return;
                }

                ($(element)).slider('setValue', modelValue);
            });

            ($(element)).slider().on('slide', function (ev) {
                scope.$apply(function () {
                    ngModel.$setViewValue(($(element)).slider('getValue'));
                    scope.$eval(attrs.ngChange);
                });
            });
        }
    };
});
//# sourceMappingURL=out.js.map
