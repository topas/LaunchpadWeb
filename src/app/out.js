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
            this.row = row;
            this.column = column;
            this.state = Launchpad.ButtonState.Disabled;
            this.sample = sample;

            if (this.sample != undefined) {
                this.sample.stateChanged().on(function (sample, state) {
                    return _this.sampleStateChanged(state);
                });
            }
        }
        Button.prototype.click = function () {
            if (this.sample == undefined) {
                this.column.stop();
                return;
            }

            this.sample.play();
        };

        Button.prototype.sampleStateChanged = function (state) {
            if (state == Launchpad.SampleState.Loaded) {
                this.state = Launchpad.ButtonState.SampleLoaded;
            }

            if (state == Launchpad.SampleState.Playing) {
                this.state = Launchpad.ButtonState.Playing;
            }

            if (state == Launchpad.SampleState.Stopped) {
                this.state = Launchpad.ButtonState.SampleLoaded;
            }

            if (state == Launchpad.SampleState.Waiting) {
                this.state = Launchpad.ButtonState.Waiting;
            }
        };
        return Button;
    })();
    Launchpad.Button = Button;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonBoard = (function () {
        function ButtonBoard(sampleManager, samplePlaySynchronizer) {
            this.columns = [];
            for (var column = 0; column < 8; column++) {
                this.columns.push(new Launchpad.ButtonColumn(column, samplePlaySynchronizer.getColumn(column)));
            }

            this.rows = [];
            for (var row = 0; row < 8; row++) {
                this.rows.push(new Launchpad.ButtonRow(row, samplePlaySynchronizer.getRow(row), this.columns, sampleManager));
            }
        }
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
        }
        ButtonColumn.prototype.addButton = function (button) {
            this.buttons.push(button);
        };

        ButtonColumn.prototype.stop = function () {
            this.sampleColumn.stop();
        };
        return ButtonColumn;
    })();
    Launchpad.ButtonColumn = ButtonColumn;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonRow = (function () {
        function ButtonRow(rowIndex, sampleRow, columns, sampleManager) {
            this.index = rowIndex;
            this.state = Launchpad.ButtonState.Disabled;
            this.buttons = [];
            this.sampleManager = sampleManager;
            this.sampleRow = sampleRow;

            for (var columnIndex = 0; columnIndex < 8; columnIndex++) {
                var sample = this.sampleManager.get(rowIndex, columnIndex);
                var column = columns[columnIndex];
                var button = new Launchpad.Button(this, column, sample);
                column.addButton(button);
                this.addButton(button);
            }
        }
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
var Launchpad;
(function (Launchpad) {
    var LaunchpadBoard = (function () {
        function LaunchpadBoard(timeoutService, midiWrapper, progressCallback) {
            this.midiWrapper = midiWrapper;

            var soundJsWrapper = new Launchpad.SoundJsWrapper();
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

            this.buttons = new Launchpad.ButtonBoard(mgr, samplePlaySynchronizer);

            mgr.loadSamples();
        }
        return LaunchpadBoard;
    })();
    Launchpad.LaunchpadBoard = LaunchpadBoard;
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
            this.onReceived = new LiteEvent();
            this.currentInput = null;
            this.currentOutput = null;
            this.inputs = midiAccess.inputs();
            this.outputs = midiAccess.outputs();
        }
        InitilializedState.prototype.received = function () {
            return this.onReceived;
        };

        InitilializedState.prototype.getInputNames = function () {
            return this.inputs.map(function (a) {
                return a.name;
            });
        };

        InitilializedState.prototype.setInputByName = function (name) {
            var _this = this;
            if (this.currentInput != null) {
                this.currentInput.onmidimessage = null;
            }

            var inputs = this.inputs.filter(function (a) {
                return a.name == name;
            });
            if (inputs.length == 1) {
                this.currentInput = inputs[0];
                this.currentInput.addEventListener("midimessage", function (message) {
                    return _this.midiMessageReceived(message);
                });
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
            } else {
                this.currentOutput = null;
            }
        };

        InitilializedState.prototype.send = function (message) {
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
                return _this.midiReceivedCallback(message);
            });
            this.onInitOk.trigger(this);
        };

        MidiApiWrapper.prototype.initFailureCallback = function () {
            this.onInitFailed.trigger(this);
        };

        MidiApiWrapper.prototype.midiReceivedCallback = function (message) {
            this.onReceived.trigger(this, message);
        };
        return MidiApiWrapper;
    })();
    Launchpad.MidiApiWrapper = MidiApiWrapper;
})(Launchpad || (Launchpad = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Launchpad;
(function (Launchpad) {
    var Sample = (function (_super) {
        __extends(Sample, _super);
        function Sample(src, type) {
            _super.call(this);
            this.srcPath = src;
            this.type = type;
        }
        Sample.prototype.setSoundInstance = function (instance) {
            var _this = this;
            this.instance = instance;
            this.setState(Launchpad.SampleState.Loaded);

            this.instance.completed().on(function () {
                return _this.sampleCompleted();
            });
        };

        Sample.prototype.src = function () {
            return this.srcPath;
        };

        Sample.prototype.play = function () {
            if (this.type == Launchpad.SampleType.Loop) {
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
        SampleColumn.prototype.addSample = function (sample) {
            var _this = this;
            this.samples.push(sample);
            sample.stateChanged().on(function (sample, state) {
                return _this.sampleStateChanged(sample, state);
            });
        };

        SampleColumn.prototype.stop = function () {
            this.samples.forEach(function (s) {
                return s.stop();
            });
        };

        SampleColumn.prototype.sampleStateChanged = function (sample, state) {
            if (state == Launchpad.SampleState.Playing) {
                var otherSamples = this.samples.filter(function (s) {
                    return s !== sample;
                });
                otherSamples.forEach(function (s) {
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

            this.soundJsWrapper.setSoundLoadedCallback(function (src) {
                return _this.soundLoadedHandler(src);
            });
        }
        SampleManager.prototype.add = function (row, column, filename, type) {
            var sample = new Launchpad.Sample(filename, type);
            var synchronizedSample = new Launchpad.SynchronizedSample(sample, this.tempoSynchronizer);

            this.samples[row][column] = synchronizedSample;
            this.samplePlaySynchronizer.add(row, column, synchronizedSample);
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
                loadSounds.push(sample.src());
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
        SamplePlaySynchronizer.prototype.add = function (row, column, sample) {
            this.columns[column].addSample(sample);
            this.rows[row].addSample(sample);
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
        SampleRow.prototype.addSample = function (sample) {
            this.samples.push(sample);
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
            this.sampleQueue = [];

            this.setProcessInterval();
        }
        TempoSynchronizer.prototype.play = function (sample) {
            this.sampleQueue.push(sample);
        };

        TempoSynchronizer.prototype.stop = function (sample) {
            var index = this.sampleQueue.indexOf(sample);
            this.sampleQueue.splice(index, 1);
            sample.stop();
        };

        TempoSynchronizer.prototype.processSampleQueue = function () {
            while (this.sampleQueue.length > 0) {
                var sample = this.sampleQueue.shift();
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

            $scope.progress = 0;
            $scope.board = new Launchpad.LaunchpadBoard($timeout, this.midiWrapper, function (total, loaded) {
                _this.updateProgress($scope, total, loaded);
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
        };

        PlayCtrl.prototype.midiSettingChanged = function ($scope) {
            this.midiWrapper.setInputByName($scope.midiInput);
            this.midiWrapper.setOutputByName($scope.midiOutput);
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
//# sourceMappingURL=out.js.map
