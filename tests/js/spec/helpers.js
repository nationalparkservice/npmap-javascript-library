beforeEach(function() {
  this.addMatchers({
    toBeNumber: function() {
      return !isNaN(this.actual);
    },
    toBeString: function() {
      return (typeof this.actual === 'string');
    }
  });
});