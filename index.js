'use strict';

module.exports = (chai, utils) => {

  require('./lib/status-methods')(method);
  require('./lib/body-methods')(method);
  require('./lib/header-methods')(method);

  function method(options) {
    utils.addMethod(chai.Assertion.prototype, options.name, function () {
      var result = {};
      var args = arguments;
      var that = this;
      var derivedPromise = getBasePromise(this._obj).then(res => {
        result.res = res;
        return res.text();
      }).then(text => {
        result.text = text;
        utils.flag(that, "result", result);
        return result;
      }).then(result => {
        this.assert(
          options.predicate(result.res, result.text, args),
          options.msgSuccess(args),
          options.msgFail(args),
          options.expected(args),
          options.actual(result.res, result.text)
        );
      });

      // credit to chai-as-promised
      transferPromiseness(that, derivedPromise);
    });
  }

  function getBasePromise(assertion) {
    return typeof assertion.then === "function" ? assertion : assertion._obj;
  }

  function transferPromiseness(assertion, promise) {
    assertion.then = promise.then.bind(promise);
  }

};


