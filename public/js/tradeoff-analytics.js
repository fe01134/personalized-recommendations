/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global $:false */

'use strict';

$(document).ready(function() {
  // GLOBAL VARIABLES
  var taClient = null;

  var loadTradeoffAnalytics = function(callback, errCallback) {
    taClient = new TradeoffAnalytics({
      dilemmaServiceUrl: '/dilemmas',
      customCssUrl: 'https://ta-cdn.mybluemix.net/modmt/styles/watson.css',
      profile: 'basic',
      errCallback: errCallback
    }, 'taWidgetContainer');

    taClient.start(callback);
  };

  var showTradeoffAnalytcsWidget = function(problem,onWidgetReady) {
    taClient.show(
      problem,
      function() {
        taClient.resize();
        $('.ta-container').show();
        $('html, body').animate({
          scrollTop: $('.ta-container').offset().top
        }, 500);
      },
      function() { /*no-op*/ }
    );

  };

  var destroyTradeoffAnalytcsWidget = function(callback) {
    taClient.destroy(callback);
  };

  var onPageLoad = function() {

  };

  var onError = function(error) {
    var errorMsg = 'Error processing the request.';
    if (error) {
      if (error.responseText) {
        errorMsg = error.responseText;
      } else {
        try {
          errorMsg = JSON.stringify(error, null, 4);
        } catch (e) {
          errorMsg = error.toString();
        }
      }
    }

    $('.errorMsg').text(errorMsg);
    $('.errorMsg').show();
    $('.result').hide();
  };

  window.onerror = onError;

  var recreateWidgetIfNeeded = function(showWidget) {
    destroyTradeoffAnalytcsWidget(function() {
      loadTradeoffAnalytics(showWidget, onError);
    });
  };

  var analyze = function() {
    var locations = [];
    $('.employee-card').each(function(_, id) {
      var name = $(id).prop('data-id');
      if (name) locations.push(name);
    });

    $.get('/get_problem', { locations: locations }, function(data) {
        recreateWidgetIfNeeded(function() {
          showTradeoffAnalytcsWidget(data);
        });
      });
  };

  $('.tradeoff-btn').click(function() {
    console.log('running tradeoff analytics...');
    analyze();
  });

  loadTradeoffAnalytics(onPageLoad, onError);
});