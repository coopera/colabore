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

      $http.get('http://colabore.herokuapp.com/api/slacknotifications')
      .success(function(data) {
        $scope.slacknotifications = data;
        $scope.slacknotifications.reverse();
        for(i = 0; i < $scope.slacknotifications.length; i++){
          $scope.slacknotifications[i]['user_name'] = $scope.slacknotifications[i].object.user_name;
          $scope.slacknotifications[i]['team_domain'] = $scope.slacknotifications[i].object.team_domain;
        };
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
}