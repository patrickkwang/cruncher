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
    samples[i] = x[Math.floor(Math.random()*x.length)];
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
  x.sort()
  position = p*(x.length-1);
  left = Math.floor(position);
  right = Math.ceil(position);
  if (left==position)
    return x[position];
  else
    return (right-position)*x[left]+(position-left)*x[right];
}
