/**
 * Web Worker for parallel fitness calculation
 * Processes pixel comparisons in background thread to avoid blocking UI
 */

// Fast pixel difference calculation
function calculatePixelDifference(rendered, target) {
  let totalDifference = 0;
  const len = target.length;

  // Unroll loop for better performance (process 4 pixels at once)
  let i = 0;
  const unrolledLen = len - (len % 16); // Process in chunks of 16 (4 pixels * 4 channels)

  for (; i < unrolledLen; i += 16) {
    // Pixel 1
    const dr1 = target[i] - rendered[i];
    const dg1 = target[i + 1] - rendered[i + 1];
    const db1 = target[i + 2] - rendered[i + 2];

    // Pixel 2
    const dr2 = target[i + 4] - rendered[i + 4];
    const dg2 = target[i + 5] - rendered[i + 5];
    const db2 = target[i + 6] - rendered[i + 6];

    // Pixel 3
    const dr3 = target[i + 8] - rendered[i + 8];
    const dg3 = target[i + 9] - rendered[i + 9];
    const db3 = target[i + 10] - rendered[i + 10];

    // Pixel 4
    const dr4 = target[i + 12] - rendered[i + 12];
    const dg4 = target[i + 13] - rendered[i + 13];
    const db4 = target[i + 14] - rendered[i + 14];

    totalDifference +=
      dr1 * dr1 +
      dg1 * dg1 +
      db1 * db1 +
      (dr2 * dr2 + dg2 * dg2 + db2 * db2) +
      (dr3 * dr3 + dg3 * dg3 + db3 * db3) +
      (dr4 * dr4 + dg4 * dg4 + db4 * db4);
  }

  // Process remaining pixels
  for (; i < len; i += 4) {
    const dr = target[i] - rendered[i];
    const dg = target[i + 1] - rendered[i + 1];
    const db = target[i + 2] - rendered[i + 2];
    totalDifference += dr * dr + dg * dg + db * db;
  }

  return totalDifference;
}

// Handle messages from main thread
self.onmessage = function (e) {
  const { type, data } = e.data;

  switch (type) {
    case 'CALCULATE_FITNESS':
      const { rendered, target, id } = data;
      const fitness = calculatePixelDifference(rendered, target);

      // Send result back to main thread
      self.postMessage({
        type: 'FITNESS_RESULT',
        data: { id, fitness },
      });
      break;

    case 'BATCH_FITNESS':
      const { batch, targetData } = data;
      const results = [];

      // Process batch of individuals
      for (const item of batch) {
        const fitness = calculatePixelDifference(item.rendered, targetData);
        results.push({ id: item.id, fitness });
      }

      self.postMessage({
        type: 'BATCH_RESULT',
        data: results,
      });
      break;

    default:
      console.warn('Unknown worker message type:', type);
  }
};
