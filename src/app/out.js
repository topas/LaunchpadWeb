var Launchpad;
(function (Launchpad) {
    var SampleBase = (function () {
        function SampleBase() {
            this.onStateChanged = new LiteEvent();
            this.state = Launchpad.SampleState.None;
        }
        SampleBase.prototype.sampleChanged = function () {
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
            this.onStateChanged.trigger(state);
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

    LiteEvent.prototype.trigger = function (data) {
        if (this.handlers) {
            this.handlers.forEach(function (h) {
                return h(data);
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
                this.sample.sampleChanged().on(function (state) {
                    return _this.sampleStateChanged(state);
                });
            }
        }
        Button.prototype.click = function () {
            if (this.sample == undefined) {
                return;
            }

            if (this.sample.state == Launchpad.SampleState.Playing || this.sample.state == Launchpad.SampleState.Waiting) {
                this.sample.stop();
            } else {
                this.sample.play();
            }
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
        function ButtonBoard(sampleManager) {
            this.columns = [];
            for (var column = 0; column < 8; column++) {
                this.columns.push(new Launchpad.ButtonColumn(column));
            }

            this.rows = [];
            for (var row = 0; row < 8; row++) {
                this.rows.push(new Launchpad.ButtonRow(row, this.columns, sampleManager));
            }
        }
        return ButtonBoard;
    })();
    Launchpad.ButtonBoard = ButtonBoard;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonColumn = (function () {
        function ButtonColumn(columnIndex) {
            this.index = columnIndex;
            this.buttons = [];
        }
        ButtonColumn.prototype.addButton = function (button) {
            this.buttons.push(button);
        };
        return ButtonColumn;
    })();
    Launchpad.ButtonColumn = ButtonColumn;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonRow = (function () {
        function ButtonRow(rowIndex, columns, sampleManager) {
            this.index = rowIndex;
            this.state = Launchpad.ButtonState.Disabled;
            this.buttons = [];
            this.sampleManager = sampleManager;

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
        function LaunchpadBoard(timeoutService, progressCallback) {
            var soundJsWrapper = new Launchpad.SoundJsWrapper();
            var tempoSynchronizer = new Launchpad.TempoSynchronizer(140, timeoutService);
            var mgr = new Launchpad.SampleManager(soundJsWrapper, "./sounds/", tempoSynchronizer);
            mgr.progressCallback = progressCallback;

            mgr.add(0, 0, "skipyofficialmusic-drums1.wav", Launchpad.SampleType.Loop);
            mgr.add(0, 1, "skyhunter-dubstep-dirty-wobble-bass.wav", Launchpad.SampleType.Loop);

            mgr.add(1, 2, "skipyofficialmusic-dark-dubstep-loop.wav", Launchpad.SampleType.Loop);
            mgr.add(1, 3, "skipyofficialmusic-heavy-dubstep-sytnth.wav", Launchpad.SampleType.Loop);
            mgr.add(1, 4, "skipyofficialmusic-heavy-dubstep-wobble.wav", Launchpad.SampleType.Loop);

            mgr.add(2, 1, "skipyofficialmusic-jump-up-synth.wav", Launchpad.SampleType.SinglePlay);
            mgr.add(2, 2, "skipyofficialmusic-skrillex-summit-lead.wav", Launchpad.SampleType.Loop);

            this.buttons = new Launchpad.ButtonBoard(mgr);

            mgr.loadSamples();
        }
        return LaunchpadBoard;
    })();
    Launchpad.LaunchpadBoard = LaunchpadBoard;
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
    var SampleManager = (function () {
        function SampleManager(soundJsWrapper, basePath, tempoSynchronizer) {
            var _this = this;
            this.basePath = basePath;
            this.soundJsWrapper = soundJsWrapper;
            this.tempoSynchronizer = tempoSynchronizer;

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
            this.onCompleted.trigger();
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
            this.sample.sampleChanged().on(function (state) {
                return _this.internalSampleStateChanged(state);
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

        SynchronizedSample.prototype.internalSampleStateChanged = function (state) {
            console.debug("" + state);
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
            $scope.progress = 0;

            $scope.board = new Launchpad.LaunchpadBoard($timeout, function (total, loaded) {
                _this.updateProgress($scope, total, loaded);
            });
            $scope.isButtonPlaying = function (button) {
                return _this.isButtonPlaying(button);
            };
        }
        PlayCtrl.prototype.isButtonPlaying = function (button) {
            return button.state == Launchpad.ButtonState.Playing || button.state == Launchpad.ButtonState.Waiting;
        };

        PlayCtrl.prototype.updateProgress = function ($scope, total, loaded) {
            $scope.$apply(function () {
                $scope.progress = (loaded / total) * 100;
            });
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
