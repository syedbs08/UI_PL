import * as moment from "moment";

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export function regExpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function replaceNullWithZero(x) {
  return (x === 'NaN' || x === null || x === '' || x === 'undefined') ? 0 : x;
}
export function parseFormattedNumber(value: string): number {
  const sanitizedValue = value.replace(/,/g, ''); // Remove commas from the string
  const parsedValue = parseFloat(sanitizedValue); // Parse the sanitized string to a float

  // Check if parsedValue is a valid number
  if (!isNaN(parsedValue)) {
    return parseFloat(parsedValue.toFixed(2)); // Convert the parsed value to a number with 2 decimal places
  } else {
    return 0; // Return default value if parsing fails
  }
}
// export function hasClassName(element: any, className: string): boolean {
//   return element && element.className && element.className.split &&
//     element.className.split(/\s+/).indexOf(className) >= 0;
// }

// if (typeof Element !== 'undefined' && !Element.prototype.closest) {
//   // Polyfill for ie10+

//   if (!Element.prototype.matches) {
//     // IE uses the non-standard name: msMatchesSelector
//     Element.prototype.matches = (Element.prototype as any).msMatchesSelector || Element.prototype.webkitMatchesSelector;
//   }

//   Element.prototype.closest = function (s: string) {
//     let el = this;
//     if (!document.documentElement.contains(el)) {
//       return null;
//     }
//     do {
//       if (el.matches(s)) {
//         return el;
//       }
//       el = el.parentElement || el.parentNode;
//     } while (el !== null && el.nodeType === 1);
//     return null;
//   };
// }

// export function closest(element: HTMLElement, selector): HTMLElement {
//   if (!selector) {
//     return null;
//   }

//   return element.closest(selector);
// }
export function isObject(val) {
  if (val === null) { return false; }
  return ((typeof val === 'function') || (typeof val === 'object'));

}
export function numberRange(min, max) {
  var min = min === null ? 1 : min;
  var range = Array.from({ length: max }, (v, k) => k + min);
  return range.map(val => ({
    Value: val,
    Text: val
  }));


}

// export function getDateRange(startDate, endDate) {
//   var dates = [],
//     currentDate = startDate,
//     addDays =  (days) => {
//       var date = new Date(this.valueOf());
//       date.setDate(date.getDate() + days);
//       return date;
//     };
//   while (currentDate <= endDate) {
//     dates.push(currentDate);
//     currentDate = addDays.call(currentDate, 1);
//   }

//   return dates.map(val => ({
//     Value: val,
//     Text: moment(val).format("DD/MM/YYYY")
//   }));

//};
// export function GetAlphaRange(length)
// {
//   var alphaRange=[];
//   for (const x of Array(length).keys()) {
//     alphaRange.push(String.fromCharCode('A'.charCodeAt(0) + x));
//   }

//   return alphaRange.map(val => ({
//     Value: val,
//     Text: val
//   }));


// }

export function  groupBy(array, key)
{
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};


export function addDays(date: Date, days: number): Date { 
  date.setDate(date.getDate() + days); 
  return date;
}
export function time_convert(num)
 { 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  return padNumber(hours) + ":" + padNumber(minutes);         
}

export function GetProfileBase64() {
  return "data:image/jpeg;base64,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";

}
export function GetDefaulBookImage()
{

  return "data:image/png;base64,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"
}

export function extensionByType(type)
{
  switch (type) {
    case "application/pdf": {
      return ".pdf"
    }
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      return ".doc"
    }
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
       return ".docx"
    }
    case "image/jpg": {
       return ".jpg"
    }
    case "image/jpeg": {
      return ".jpeg"
   }
   case "image/png": {
    return ".png"
 }
   
    
    default: {
      return ".pdf"
    }
  }


}