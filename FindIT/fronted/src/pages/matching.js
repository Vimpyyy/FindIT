import stringSimilarity from 'string-similarity';
import './matching.css';

/**
 * Compare two images by converting them to pixel data
 * @param {string} imageUrl1 - URL of the first image
 * @param {string} imageUrl2 - URL of the second image
 * @returns {Promise<boolean>} - True if images are similar, false otherwise
 */
const compareImages = async (imageUrl1, imageUrl2) => {
  try {
    const loadImage = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Allow cross-origin images
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

    const img1 = await loadImage(imageUrl1);
    const img2 = await loadImage(imageUrl2);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Resize images to a fixed size for comparison
    const width = 100;
    const height = 100;
    canvas.width = width;
    canvas.height = height;

    // Draw the first image
    context.drawImage(img1, 0, 0, width, height);
    const data1 = context.getImageData(0, 0, width, height).data;

    // Clear the canvas and draw the second image
    context.clearRect(0, 0, width, height);
    context.drawImage(img2, 0, 0, width, height);
    const data2 = context.getImageData(0, 0, width, height).data;

    // Compare pixel data
    let diff = 0;
    for (let i = 0; i < data1.length; i++) {
      diff += Math.abs(data1[i] - data2[i]);
    }

    // Normalize the difference and determine similarity
    const maxDiff = width * height * 4 * 255; // Max possible difference
    const similarity = 1 - diff / maxDiff;

    return similarity > 0.8; // Adjust threshold as needed
  } catch (error) {
    console.error('Error comparing images:', error);
    return false;
  }
};

/**
 * Rule-based matching function with equal scoring
 * @param {Array} lostItems - List of lost items
 * @param {Array} foundItems - List of found items
 * @returns {Promise<Array>} - List of matches
 */
const matchItems = async (lostItems, foundItems) => {
  const matches = [];

  for (const lostItem of lostItems) {
    for (const foundItem of foundItems) {
      let matchScore = 0;
      const totalRules = 4; // Total number of rules

      // Rule 1: Compare itemName (equal weight)
      const nameSimilarity = stringSimilarity.compareTwoStrings(
        lostItem.itemName.toLowerCase(),
        foundItem.itemName.toLowerCase()
      );
      matchScore += nameSimilarity;

      // Rule 2: Compare description (equal weight)
      const descriptionSimilarity = stringSimilarity.compareTwoStrings(
        lostItem.description.toLowerCase(),
        foundItem.description.toLowerCase()
      );
      matchScore += descriptionSimilarity;

      // Rule 3: Compare location (equal weight)
      const locationSimilarity = stringSimilarity.compareTwoStrings(
        lostItem.location.toLowerCase(),
        foundItem.location.toLowerCase()
      );
      matchScore += locationSimilarity;

      // Rule 4: Compare images (equal weight)
      let imageSimilarity = 0;
      if (lostItem.image && foundItem.image) {
        const imageUrl1 = `http://localhost:5000/${lostItem.image}`;
        const imageUrl2 = `http://localhost:5000/${foundItem.image}`;
        console.log(`Comparing images: ${imageUrl1} and ${imageUrl2}`);
        const isImageMatch = await compareImages(imageUrl1, imageUrl2);
        imageSimilarity = isImageMatch ? 1 : 0; // 1 for match, 0 for no match
        console.log(`Image match result for ${lostItem.image} and ${foundItem.image}:`, isImageMatch);
      }
      matchScore += imageSimilarity;

      // Normalize matchScore to a percentage
      const normalizedScore = (matchScore / totalRules) * 100;

      // If the match score exceeds the threshold, add to matches
      if (normalizedScore >= 50) { // Threshold: 50%
        matches.push({
          lostItem: {
            ownerId: lostItem.user.toString(), // Use the correct field
            itemName: lostItem.itemName,
            description: lostItem.description,
            location: lostItem.location,
            ownerName: lostItem.ownerName,
            ownerPhoneNumber: lostItem.ownerPhoneNumber,
            ownerEmail: lostItem.ownerEmail,
            ownerAddress: lostItem.ownerAddress,
            image: lostItem.image,
          },
          foundItem: {
            founderId: foundItem.user.toString(), // Use the correct field
            itemName: foundItem.itemName,
            description: foundItem.description,
            location: foundItem.location,
            founderName: foundItem.founderName,
            founderPhoneNumber: foundItem.founderPhoneNumber,
            founderEmail: foundItem.founderEmail,
            image: foundItem.image,
          },
          matchScore: Math.round(normalizedScore), // Include match score for debugging
        });
      }
    }
  }

  console.log('Matches:', matches); // Debugging log to verify matches
  return matches;
};

export default matchItems;