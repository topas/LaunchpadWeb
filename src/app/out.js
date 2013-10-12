var Launchpad;
(function (Launchpad) {
    var Button = (function () {
        function Button(row, column) {
            this.row = row;
            this.column = column;
            this.state = Launchpad.ButtonState.Waiting;
        }
        Button.prototype.click = function () {
            alert("click [" + this.row + "," + this.column + "]");
        };
        return Button;
    })();
    Launchpad.Button = Button;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var ButtonRow = (function () {
        function ButtonRow(rowIndex) {
            this.state = Launchpad.ButtonState.Waiting;
            this.buttons = [];
            for (var column = 0; column < 8; column++) {
                this.buttons.push(new Launchpad.Button(rowIndex, column));
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
        function LaunchpadBoard() {
            this.buttonRows = [];
            for (var row = 0; row < 8; row++) {
                this.buttonRows.push(new Launchpad.ButtonRow(row));
            }
        }
        return LaunchpadBoard;
    })();
    Launchpad.LaunchpadBoard = LaunchpadBoard;
})(Launchpad || (Launchpad = {}));
var Launchpad;
(function (Launchpad) {
    var PlayCtrl = (function () {
        function PlayCtrl($scope) {
            $scope.board = new Launchpad.LaunchpadBoard();
        }
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
