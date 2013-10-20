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
        function Button(row, column, sample, playSynchronizer) {
            var _this = this;
            this.row = row;
            this.column = column;
            this.state = Launchpad.ButtonState.Disabled;
            this.sample = sample;
            this.playSynchronizer = playSynchronizer;

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

            if (this.sample.state == Launchpad.SampleState.Playing) {
                this.sample.stop();
            } else {
                this.playSynchronizer.play(this.sample);
                this.state = Launchpad.ButtonState.Waiting;
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
        };
        return Button;
    })();
    Launchpad.Button = Button;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonRow = (function () {
        function ButtonRow(rowIndex, sampleManager, playSynchronizer) {
            this.state = Launchpad.ButtonState.Disabled;
            this.buttons = [];
            this.sampleManager = sampleManager;
            this.playSynchronizer = playSynchronizer;

            for (var column = 0; column < 8; column++) {
                var sample = this.sampleManager.get(rowIndex, column);
                this.buttons.push(new Launchpad.Button(rowIndex, column, sample, playSynchronizer));
            }
        }
        ButtonRow.prototype.click = function () {
            for (var button in this.buttons) {
                button.play();
            }
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
            var mgr = new Launchpad.SampleManager(soundJsWrapper, "./sounds/");
            mgr.progressCallback = progressCallback;

            mgr.add(0, 0, "skipyofficialmusic-drums1.wav", Launchpad.SampleType.Loop);
            mgr.add(0, 1, "skyhunter-dubstep-dirty-wobble-bass.wav", Launchpad.SampleType.Loop);

            mgr.add(1, 2, "skipyofficialmusic-dark-dubstep-loop.wav", Launchpad.SampleType.Loop);
            mgr.add(1, 3, "skipyofficialmusic-heavy-dubstep-sytnth.wav", Launchpad.SampleType.Loop);
            mgr.add(1, 4, "skipyofficialmusic-heavy-dubstep-wobble.wav", Launchpad.SampleType.Loop);

            mgr.add(2, 1, "skipyofficialmusic-jump-up-synth.wav", Launchpad.SampleType.SinglePlay);
            mgr.add(2, 2, "skipyofficialmusic-skrillex-summit-lead.wav", Launchpad.SampleType.Loop);

            var playSynchronizer = new Launchpad.PlaySynchronizer(140, timeoutService);

            this.buttonRows = [];
            for (var row = 0; row < 8; row++) {
                this.buttonRows.push(new Launchpad.ButtonRow(row, mgr, playSynchronizer));
            }

            mgr.loadSamples();
        }
        return LaunchpadBoard;
    })();
    Launchpad.LaunchpadBoard = LaunchpadBoard;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var PlaySynchronizer = (function () {
        function PlaySynchronizer(bpm, timeoutService) {
            this.timeoutService = timeoutService;
            this.tempoDelay = this.getDelayByBpm(bpm);
            this.sampleQueue = [];

            this.setProcessInterval();
        }
        PlaySynchronizer.prototype.play = function (sample) {
            this.sampleQueue.push(sample);
        };

        PlaySynchronizer.prototype.processSampleQueue = function () {
            while (this.sampleQueue.length > 0) {
                var sample = this.sampleQueue.shift();
                sample.play();
            }
            this.setProcessInterval();
        };

        PlaySynchronizer.prototype.setProcessInterval = function () {
            var _this = this;
            this.timeoutService(function () {
                return _this.processSampleQueue();
            }, this.tempoDelay);
        };

        PlaySynchronizer.prototype.getDelayByBpm = function (bpm) {
            var minute = 1000 * 60;
            return (minute / bpm) * 4 * 4;
        };
        return PlaySynchronizer;
    })();
    Launchpad.PlaySynchronizer = PlaySynchronizer;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var Sample = (function () {
        function Sample(src, type) {
            this.onStateChanged = new LiteEvent();
            this.src = src;
            this.type = type;
            this.state = Launchpad.SampleState.None;
        }
        Sample.prototype.sampleChanged = function () {
            return this.onStateChanged;
        };

        Sample.prototype.setSoundInstance = function (instance) {
            var _this = this;
            this.instance = instance;
            this.setState(Launchpad.SampleState.Loaded);

            this.instance.completed().on(function () {
                return _this.sampleCompleted();
            });
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

        Sample.prototype.setState = function (state) {
            if (this.state != state) {
                this.state = state;
                this.onStateChanged.trigger(state);
            }
        };
        return Sample;
    })();
    Launchpad.Sample = Sample;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var SampleManager = (function () {
        function SampleManager(soundJsWrapper, basePath) {
            var _this = this;
            this.basePath = basePath;
            this.soundJsWrapper = soundJsWrapper;

            this.samples = new Array(8);
            for (var i = 0; i < 8; i++) {
                this.samples[i] = new Array(8);
            }

            this.soundJsWrapper.setSoundLoadedCallback(function (src) {
                return _this.soundLoadedHandler(src);
            });
        }
        SampleManager.prototype.add = function (row, column, filename, type) {
            this.samples[row][column] = new Launchpad.Sample(filename, type);
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
                loadSounds.push(sample.src);
                _this.samplesCount++;
            });

            this.soundJsWrapper.loadSounds(loadSounds, this.basePath);
        };

        SampleManager.prototype.soundLoadedHandler = function (src) {
            var _this = this;
            this.forEachSample(function (sample) {
                if (sample.src != src) {
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
