function sum(x) {
  var total = 0;
  for (i=0; i < x.length; i++) {
    total += x[i];
  }
  return total;
}

function mean(x) {
  return sum(x) / x.length;
}

function stdv(x) {
  mu = mean(x);
  var total2 = 0;
  for (i=0; i<x.length; i++) {
    var diff = x[i]-mu;
    total2 += diff*diff
  }
  return Math.sqrt(total2/x.length)
}

function bootstrap(x,n) {
  var samples = new Array(n);
  for (i=0; i<n; i++) {
    var ind = Math.floor(Math.random()*x.length);
    if (isNaN(x[ind])) {
      i--;
      continue
    }
    samples[i] = x[ind];
  }
  return samples;
}

function histogram(x,edges) {
  // count elements of x between the edges
  // edges[j]<=x[i]<edges[j+1]
  counts = new Array(edges.length-1);
  for (j=0; j<counts.length; j++) { counts[j]=0; }
  for (i=0; i<x.length; i++) {
    for (j=0; j<edges.length-1; j++) {
      if (edges[j]<=x[i] && x[i]<edges[j+1]) {
        counts[j] += 1;
        break;
      }
    }
  }
  return counts;
}

function icdf(x,p) {
  // inverse cumulative distribution function computation
  // mostly for inferring confidence intervals
  //
  // performs linear interpolation between data points
  x.sort(function(a, b){return a-b})
  position = p*(x.length-1);
  left = Math.floor(position);
  right = Math.ceil(position);
  if (left==position)
    return x[position];
  else
    return (right-position)*x[left]+(position-left)*x[right];
}

function linearFit(x,y) {
  // clone the arrays so that when we remove NaNs, it doesn't affect the originals
  x = x.slice(0);
  y = y.slice(0);
  for (var i=x.length-1; i>=0; i--) {
    if (isNaN(x[i]) || isNaN(y[i])) {
      x.splice(i,1);
      y.splice(i,1);
    }
  }

  // solve the system of equations y=mx+b
  var ones = new Array(x.length).fill(1);
  x = ones.concat(x);
  return solve(y.length,x,2,y);
}

function solve(n,A,m,b) {
  // solve the system Ax=b
  // x = pinv(A)*b
  // where pinv() is the Moore-Penrose pseudoinverse and * is matrix multiplication
  // A should be n-by-m and b should be n-by-1
  return mtimes(m,pinv(n,A,m),n,b,1)
}

function pinv(n,A,m) {
  // Moore-Penrose pseudoinverse
  // inv(A'*A)*A'
  if (m!=2) error("A should be n-by-2");
  At = transpose(n,A,m);
  return mtimes(m,invert(mtimes(m,At,n,A,m)),m,At,n);
}

function transpose(n,A,m) {
  B = new Array(n*m);
  for (var i=0; i<n; i++)
    for (var j=0; j<m; j++)
      B[j+i*m] = A[i+j*n];
  return B;
}

function invert(x) {
  // invert a 2x2 matrix
  if (x.length!=4) error("x should be n-by-2");
  det = x[0]*x[3]-x[1]*x[2];
  return [x[3]/det,-x[1]/det,-x[2]/det,x[0]/det];
}

function mtimes(n,x,l,y,m) {
  // [n, l] = size(x)
  // [l, m] = size(y)
  z = new Array(n*m).fill(0);
  for (var i=0; i<n; i++) { // cols
    for (var j=0; j<m; j++) { // rows
      for (var k=0; k<l; k++) {
        z[i+n*j] += x[i+n*k]*y[k+l*j];
      }
    }
  }
  return z;
}

function predict(x,fit) {
  // fit is a 2-element array of the form [b, m]
  if (Array.isArray(x)) {
    var y = new Array(x.length);
    for (var i=0; i<x.length; i++)
      y[i] = fit[0] + x[i]*fit[1];
  }
  else
    y = fit[0] + x*fit[1];
  return y;
}

function rmse(x,y,fit) {
  // root mean squared error, ignores NaNs

  // clone the arrays so that when we remove NaNs, it doesn't affect the originals
  x = x.slice(0);
  y = y.slice(0);
  for (var i=x.length-1; i>=0; i--) {
    if (isNaN(x[i]) || isNaN(y[i])) {
      x.splice(i,1);
      y.splice(i,1);
    }
  }

  xhat = predict(x,fit);
  if (Array.isArray(x)) {
    var sse = 0; // sum of squared errors
    for (var i=0; i<x.length; i++)
      sse += Math.pow(xhat[i]-y[i],2)
    return Math.sqrt(sse/x.length);
  }
  else
    return Math.abs(xhat-x);
}

function r2(x,y,fit) {
  // "coefficient of determination", ignores NaNs

  // clone the arrays so that when we remove NaNs, it doesn't affect the originals
  x = x.slice(0);
  y = y.slice(0);
  for (var i=x.length-1; i>=0; i--) {
    if (isNaN(x[i]) || isNaN(y[i])) {
      x.splice(i,1);
      y.splice(i,1);
    }
  }

  yhat = predict(x,fit);
  ybar = mean(y);
  if (Array.isArray(x)) {
    var sse = 0; // sum of squared errors
    for (var i=0; i<x.length; i++)
      sse += Math.pow(yhat[i]-y[i],2)
    var tss = 0; // total sum of squares
    for (var i=0; i<x.length; i++)
      tss += Math.pow(ybar-y[i],2)
    return 1-sse/tss;
  }
  else
    throw "input should be an array";
}

function getMinOfArray(x) {
  var nanToInf = function(el,i,arr){return isNaN(el)?Infinity:el}
  return Math.min.apply(null,x.map(nanToInf));
}

function getMaxOfArray(x) {
  var nanToNegInf = function(el,i,arr){return isNaN(el)?-Infinity:el}
  return Math.max.apply(null,x.map(nanToNegInf));
}

function subtractArrays(a, b, n) {
  var c = new Array(n);
  for (var i=0; i<n; i++)
    c[i] = a[i]-b[i];
  return c;
}
