/* eslint-disable no-extra-semi */
function numberToWords(num) {
  if (num === 0) return "Zero only";

  const belowTwenty = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen"
  ];

  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
  ];

  const thousands = ["", "thousand"];

  function convertToWords(n) {
    if (n < 20) return belowTwenty[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "");
    if (n < 1000) return belowTwenty[Math.floor(n / 100)] + " hundred" + (n % 100 !== 0 ? " " + convertToWords(n % 100) : "");

    for (let i = 0; i < thousands.length; i++) {
      const divisor = Math.pow(1000, i);
      if (n < divisor * 1000) {
        return convertToWords(Math.floor(n / divisor)) + " " + thousands[i] + (n % divisor !== 0 ? " " + convertToWords(n % divisor) : "");
      };
    };
  };

  const wholeNumber = Math.floor(num);

  const words = convertToWords(wholeNumber).trim() + " only";
  const capitalizedWords = words.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return capitalizedWords;
};

export default numberToWords;