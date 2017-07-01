var app = angular.module('RequestBlockerApp', []);

app.controller('PopupController', function($scope) {

    $scope.isValidPattern = function(urlPattern) {
      var validPattern = /^(file:\/\/.+)|(https?|ftp|\*):\/\/(\*|\*\.([^\/*]+)|([^\/*]+))\//g;
      return !!urlPattern.match(validPattern);
    }

    $scope.backgroundPage = chrome.extension.getBackgroundPage();
    $scope.patterns = $scope.backgroundPage.patterns.map(function(x, i) {
        return {
            index: i,
            pattern: x,
            isValid: function() {
              return $scope.isValidPattern(this.pattern);
            }
        };
    });

    $scope.remove = function(patternToRemove) {
        var index = $scope.patterns.indexOf(patternToRemove);
        if (index > -1) {
            $scope.patterns.splice(index, 1);
        }
    }

    $scope.add = function() {
        $scope.patterns.push({
            index: $scope.patterns.length,
            pattern: '*://*.'
        });
    }

    $scope.save = function() {
        var patterns = $scope.patterns.map(function(x) {
            return x.pattern;
        });

        $scope.backgroundPage.save(patterns, function() {
            $scope.$apply(function() {
                $scope.success('Patterns saved successfully!');
            });
        });
    };

    $scope.success = function(message, title) {
        $scope.modal(message, title || "Success", "text-info");
    }
    $scope.error = function(message, title) {
        $scope.modal(message, title || "Error", "text-danger");
    }
    $scope.modal = function(message, title, modalClass) {
        $scope.modalClass = modalClass;
        $scope.modalTitle = title;
        $scope.modalMessage = message;
        $('#modal').modal();
    }
});
