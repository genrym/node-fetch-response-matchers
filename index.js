'use strict';
 const statusMethods = require('./lib/status-methods'),
       bodyMethods = require('./lib/body-methods');

module.exports = (chai, utils) => {

  statusMethods.addStatusMethods(method);
  bodyMethods.addBodyMethods(method);



  function method(options) {
    utils.addMethod(chai.Assertion.prototype, options.name, function () {
      var result = {};
      var args = arguments;
      return this._obj.then(res => {
        result.res = res;
        return res.text();
      }).then(text => {
        result.text = text;
        return result;
      }).then(result => {
        this.assert(
          options.predicate(result.res, result.text, args),
          options.msgSuccess,
          options.msgFail,
          options.expected(args),
          options.actual(result.res, result.text)
        );
      });
    });
  }

};


