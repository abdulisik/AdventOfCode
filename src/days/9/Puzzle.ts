const first = (diskMap: string) => {
  // There is an assumption that none of the files have a size of 0, which is true for the input
  let checksum = 0;

  // Indices
  let writeIndex = 0; // Write into the compacted section from the left
  let readIndex = diskMap.length - 1; // Parse the input from the right
  let imaginaryIndex = 0;

  let currentFileId = 0; // Current file being read from the right
  let currentFileCount = 0; // Remaining blocks of the current file

  while (writeIndex <= readIndex || currentFileCount > 0) {
    // Read existing file at writeIndex and add to checksum
    if (writeIndex % 2 === 0 && writeIndex <= readIndex) {
      const fileId = Math.floor(writeIndex / 2);
      const fileSize = Number(diskMap[writeIndex]);
      for (let i = 0; i < fileSize; i++) {
        checksum += imaginaryIndex * fileId;
        imaginaryIndex++;
      }
    }

    // Fill empty spaces with files from the right, or finish filling the file on hand if indexes met
    if (writeIndex % 2 !== 0 || writeIndex >= readIndex) {
      const spaceSize =
        writeIndex > readIndex ? currentFileCount : Number(diskMap[writeIndex]);
      for (let i = 0; i < spaceSize; i++) {
        // If we run out of blocks in the current file, grab the next one from the right
        if (currentFileCount === 0 && readIndex > writeIndex) {
          currentFileId = Math.floor(readIndex / 2);
          currentFileCount = Number(diskMap[readIndex]);
          readIndex -= 2;
        }
        if (currentFileCount === 0) {
          break;
        }
        checksum += imaginaryIndex * currentFileId;
        imaginaryIndex++;
        currentFileCount--;
      }
    }
    writeIndex++;
  }

  return checksum;
};

const expectedFirstSolution = '1928'; // 60 for the small example

const parseDiskMap = (diskMap: string): [number, number][] => {
  const compactArray: [number, number][] = [];
  for (let i = 0; i < diskMap.length; i += 2) {
    compactArray.push([Math.floor(i / 2), Number(diskMap[i])]);
    compactArray.push([-1, Number(diskMap[i + 1])]);
  }
  return compactArray;
};

const compactDisk = (diskArray: [number, number][]): [number, number][] => {
  for (let i = diskArray.length - 1; i > 0; i--) {
    const [fileId, fileLength] = diskArray[i];
    if (fileId === -1) {
      continue;
    } // Skip free space

    // Find the leftmost free space that fits the file
    for (let j = 0; j < i; j++) {
      const [spaceId, spaceLength] = diskArray[j];
      if (spaceId === -1 && spaceLength >= fileLength) {
        // Move file to the free space
        diskArray[j] = [fileId, fileLength];
        diskArray[i] = [-1, fileLength];
        // Keep the remaining space
        // Note: We're fragmenting the spaces, or inserting a space of length 0, both of which do not matter
        diskArray.splice(j + 1, 0, [-1, spaceLength - fileLength]);
        // Increment the index since the array has grown
        i++;
        break;
      }
    }
  }
  return diskArray;
};

const calculateChecksum = (diskArray: [number, number][]): number => {
  let checksum = 0;
  let position = 0;
  for (const [fileId, fileLength] of diskArray) {
    if (fileId === -1) {
      position += fileLength; // Skip free space
      continue;
    }
    for (let i = 0; i < fileLength; i++) {
      checksum += position * fileId;
      position++;
    }
  }
  return checksum;
};

const second = (diskMap: string): number => {
  const diskArray = parseDiskMap(diskMap);
  const compactedArray = compactDisk(diskArray);
  return calculateChecksum(compactedArray);
};

const expectedSecondSolution = '2858';

export { first, expectedFirstSolution, second, expectedSecondSolution };
