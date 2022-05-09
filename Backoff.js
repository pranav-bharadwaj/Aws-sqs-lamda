const backoff = (base, cap) => {
  return Math.min(cap, Math.pow(2, n) * base);
};
const expo = (n) => {
  var base = expo(n);
  var fulljitter = Math.floor(Math.random() * base + 1);
  return fulljitter;
};
module.exports = { expo, backoff };
