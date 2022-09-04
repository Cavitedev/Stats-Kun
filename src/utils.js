    function getWeightedValue(allValues) {
    return (allValues.reduce((prev, current, index) => prev + (current * Math.pow(0.95, index)), 0) / allValues.reduce((prev, _current, index) => prev + (Math.pow(0.95, index)), 0)).toFixed(2);
  }
  
  function msToAr(ms) {
    return (ms >= 1200) ? (((-5 * (ms - 1200)) / 600) + 5) : (((5 * (1200 - ms)) / 750) + 5);
  }
  
  function arToMs(ar) {
    return (ar <= 5) ? (1200 + ((600 * (5 - ar)) / 5)) : (1200 - ((750 * (ar - 5)) / 5));
  }

  module.exports = {getWeightedValue, msToAr, arToMs};