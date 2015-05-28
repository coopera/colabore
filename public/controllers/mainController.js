var teamtracker = angular.module('teamtracker', ['tableSort']);

function mainController($scope, $http, $timeout) {

    window.scope = $scope;
    $http.get('http://colabore.herokuapp.com/api/gitnotifications')
      .success(function(data) {
        $scope.notifications = data;

        for (var i = 0; i < $scope.notifications.length; ++i) {
          $scope.notifications[i] = { 
            repo: $scope.notifications[i].repo,
            actor: $scope.notifications[i].actor,
            event_name: $scope.notifications[i].event_name,
            event_time: $scope.notifications[i].event_time
          };
        }

        $scope.notifications.reverse();
        $scope.notifications.splice(335, $scope.notifications.length-335);

        (function poll (time) {
          $timeout(function () {
            var i = 1;
            $('[class^="status-"]').html('x 1');

            for (var i = 0; i < $scope.notifications.length; ++i) {
              var actual = $('.not-' + i).data('model');
              var equals = 1;

              for (var j = i + 1; j < $scope.notifications.length; ++j) {
                var prev = $('.not-' + j).data('model');
                var equal = (!$scope.repo || prev.repo == actual.repo) 
                  && (!$scope.gh_user || prev.actor == actual.actor)
                  && (!$scope.event || prev.event_name == actual.event_name)
                  && (!$scope.hour || prev.event_time == actual.event_time);

                if (equal) {
                  equals++;
                  $('.not-' + j).hide();
                }
              }

              $('.status-' + i).html('x ' + equals);
            }

            $scope.$digest();
            poll(5000);
          }, time);
        })(1000);

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