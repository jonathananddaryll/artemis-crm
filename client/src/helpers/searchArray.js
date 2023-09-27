// Helper function for reducers involving any text search of cached tables

// Returns an array of numbers in reference to the searchArray array index
// Numbers are unsorted and do not represent any order
// Match is considered positive when the string inside the contact property includes
// one of the words inside the search input string. "" => [].

// TODO: finish out the search results sorting thing

export default function SearchArray(searchString, searchArray, searchType) {
  // validate and modify the input for easier searching algo
  let trimmed = searchString
    .split('')
    .filter((element, index, array) => {
      if (index < array.length - 1) {
        if (element === ' ') {
          if (array[index + 1] !== ' ') {
            return element;
          }
        } else {
          return element;
        }
      } else {
        return element;
      }
    })
    .join('');

  if (trimmed === '') {
    return [searchArray];
  }
  function includesTLC(bigString, littleString) {
    return bigString.toLowerCase().includes(littleString.toLowerCase());
  }
  let results = [];
  // Now that the string has been trimmed, a switch case based on the searchType
  switch (searchType) {
    case 'name':
      const searchWords = (contactsArray, arrayOfWords) => {
        for (let contact = 0; contact < contactsArray.length; contact++) {
          for (let name = 0; name < arrayOfWords.length; name++) {
            // Keeping this logic just for sorting purposes later
            if (
              includesTLC(contactsArray[contact].first_name, arrayOfWords[name])
            ) {
              if (
                includesTLC(
                  contactsArray[contact].last_name,
                  arrayOfWords[name]
                )
              ) {
                results.push(contact);
              } else {
                results.push(contact);
              }
            } else if (
              includesTLC(contactsArray[contact].last_name, arrayOfWords[name])
            ) {
              results.push(contact);
            }
          }
        }
        return results;
      };
      if (trimmed.split(' ')[1] !== '') {
        let namesArray = trimmed.split(' ');
        return searchWords(searchArray, namesArray);
      } else {
        let namesArray = [trimmed];
        return searchWords(searchArray, namesArray);
      }
    case 'company':
      for (let contact = 0; contact < searchArray.length; contact++) {
        for (let search = 0; search < trimmed.split(' ').length; search++) {
          if (includesTLC(searchArray[contact].company, trimmed[search])) {
            results.push(contact);
          }
        }
      }
      return results;
    case 'location':
      for (let contact = 0; contact < searchArray.length; contact++) {
        for (let search = 0; search < trimmed.split(' ').length; search++) {
          if (includesTLC(searchArray[contact].location, trimmed[search])) {
            results.push(contact);
          }
        }
      }
      return results;
    case 'id':
      let idNum = Number(searchString) !== NaN ? Number(searchString) : false;
      if (idNum) {
        for (let contact = 0; contact < searchArray.length; contact++) {
          if (searchArray[contact].id === Number(searchString)) {
            return contact;
          }
        }
      } else {
        return -1;
      }
    default:
      return results;
  }
}
