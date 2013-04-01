function ApodCtrl($scope, $http, Chameleon, version) {

  var bugsense = new Bugsense({ apiKey: '20491ba5', appversion: version });

  // This has to be done like this or it doesn't work.
  // I should probably figure out why at some point, but not right now.
  setTimeout(function () {
    Chameleon.init({ version: version });
  }, 1);

  $scope.$on('chameleon.refresh', function () {
    refreshImage();
  });

  $scope.$on('chameleon.load', startPolling);
  $scope.$on('chameleon.resume', startPolling);
  $scope.$on('chameleon.pause', stopPolling);
  $scope.$on('chameleon.connect', startPolling);
  $scope.$on('chameleon.disconnect', stopPolling);
  $scope.$on('chameleon.notchameleon', startPolling);

  function startPolling(event) {
    stopPolling();
    refreshImage();
    $scope.$emit('chameleon.polling.start', {
      id: 'refresh-timer',
      interval: 60 * 60,
      callback: function () {
        refreshImage();
      }
    });
  }

  function stopPolling(event) {
    $scope.$emit('chameleon.polling.stop', {
      id: 'refresh-timer'
    });
  }

  function refreshImage() {
    $http.get('http://widgetgecko.com/api/apod/apod.json?t=' +  Math.round((new Date()).getTime() / 1000))
      .success(function (data) {
        $scope.apod = data;
        $scope.apod.background = 'url("' + data.image + '")';
        $scope.$emit('chameleon.setTitle', 'APOD | ' + data.title);
        $scope.$emit('chameleon.invalidate');
      })
      .error(function (data, status, headers, config) {
        bugsense.notify(new Error('Refresh Error'));
      });
  }

  $scope.openApod = function () {
    $scope.$emit('chameleon.openLink', 'http://apod.nasa.gov/apod/astropix.html');
  }

  $scope.apod = {};
}