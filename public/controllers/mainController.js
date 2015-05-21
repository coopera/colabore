var teamtracker = angular.module('teamtracker', []);

function mainController($scope, $http) {

    $http.get('http://colabore.herokuapp.com/api/gitnotifications')
      .success(function(data) {
        $scope.notifications = data;
        $scope.notifications.reverse();
        console.log($scope.notifications.length);
        $scope.notifications.splice(335, $scope.notifications.length-335);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
}