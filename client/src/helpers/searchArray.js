// Helper function for reducers involving any text search of the cached contacts

// Returns an array of entries:
// [
// [
//  index , {[property]: String, 
//            hits: Number}
// ],
// [
//  index , {[property]: String,
//            hits: Number}
// ],
// ]

// index is in reference to the index of each element in the given searchArray
// Match is considered positive hit when a string at the searchArray[index].<property>
// includes one of the keywords inside the searchString (if there is more than one)

export default function SearchArray(searchString, searchArray, searchType) {
  // This function performs all the actual searching, just a basic .includes()
  const aIncludesB = (a, b) => {
    return a?.toLowerCase().includes(b?.toLowerCase());
  };

  // For sorting the search results object 
  // This takes in an object, returns an array of arrays(entries)
  // sorted first by 'hits', then by .localeCompare()
  const sortResults = (results, keywords) => {
    let indexedContacts = Object.entries(results);
    return indexedContacts.sort((a, b) => {
      // first sort by hits
      if (a[1].hits > b[1].hits) {
        return -1;
      } else if (b[1].hits > a[1].hits) {
        return 1;
      } else {
        if(!a[1][searchType] || !b[1][searchType]){
          return 0
        }else{
          return a[1][searchType].localeCompare(b[1][searchType]);
        }
      }
    });
  };

  // Just eliminating any funny stuff
  if (
    !searchString ||
    !searchString.length ||
    !searchType ||
    !searchArray.length
  ) {
    return [];
  } else {
    if (searchString.split(' ').length > 1) {
      // start with an object to keep track of results and sorting by hits
      const numberOfMatches = {};

      // split the search string into separate words => an array of words
      const keywords = searchString.split(' ');
      
      // Then loop through all the contacts in searchArray
      for (
        let eachContact = 0;
        eachContact < searchArray.length;
        eachContact++
      ) {
        // Each time also looping through each keyword given
        for (
          let eachKeyword = 0;
          eachKeyword < keywords.length;
          eachKeyword++
        ) {
          // If the user is searching for names, it requires some separate logic
          // to bring both the first_name property and the last_name property together.
          // Otherwise if you skip to the else that comes after this, you'll see the
          // standard and simple logic.
          if (searchType === 'name') {
            const firstName = searchArray[eachContact].first_name;
            const lastName = searchArray[eachContact].last_name;
            if (
              aIncludesB(
                searchArray[eachContact].first_name,
                keywords[eachKeyword]
              )
            ) {
              if (!numberOfMatches[eachContact]) {
                numberOfMatches[eachContact] = {
                  first_name: firstName,
                  last_name: lastName,
                  hits: 1,
                };
              } else {
                numberOfMatches[eachContact].hits =
                  numberOfMatches[eachContact].hits + 1;
              }
            } else if (
              aIncludesB(
                searchArray[eachContact].last_name,
                keywords[eachKeyword]
              )
            ) {
              if (!numberOfMatches[eachContact]) {
                numberOfMatches[eachContact] = {
                  first_name: firstName,
                  last_name: lastName,
                  hits: 1,
                };
              } else {
                numberOfMatches[eachContact].hits =
                  numberOfMatches[eachContact].hits + 1;
              }
            }
          }else{
          // This is the standard logic for searching any contact record property that is
          // a string value -- flexible! Can search all properties using multiple keywords.
            if(aIncludesB(
              searchArray[eachContact][searchType], 
              keywords[eachKeyword]
            )){
              if(!numberOfMatches[eachContact]){
                numberOfMatches[eachContact] = {
                  [searchType]: searchArray[eachContact][searchType],
                  hits: 1
                }
              }else{
                numberOfMatches[eachContact].hits = numberOfMatches[eachContact].hits + 1;
              }
            }
          }
        }
      }
      // return the array of entries, sorted
      return sortResults(numberOfMatches, keywords);
    } else {
      // Otherwise it's simpler, just one loop for the contact array length
      const numberOfMatches = {};
      for (
        let eachContact = 0;
        eachContact < searchArray.length;
        eachContact++
      ) {

        // if this is a name search, it is an exception to standard logic because I want 
        // to improve how the hits are calculated. Hits on both first and last names are stronger.
        if (searchType === 'name') {
          const firstName = searchArray[eachContact].first_name;
          const lastName = searchArray[eachContact].last_name;
          if (
        // if both the first and last name include the searchString,
        // this result has 2 hits
            aIncludesB(firstName, searchString) &&
            aIncludesB(lastName, searchString)
          ) {
            if (!numberOfMatches[eachContact]) {
              numberOfMatches[eachContact] = {
                first_name: firstName,
                last_name: lastName,
                hits: 2,
              };
            } else {
              numberOfMatches[eachContact].hits =
                numberOfMatches[eachContact].hits + 2;
            }
          } else if (aIncludesB(lastName, searchString)) {
        // Otherwise if just the last name matches, 1 hit
            if (!numberOfMatches[eachContact]) {
              numberOfMatches[eachContact] = {
                first_name: firstName,
                last_name: lastName,
                hits: 1,
              };
            } else {
              numberOfMatches[eachContact].hits =
                numberOfMatches[eachContact].hits + 1;
            }
          } else if (aIncludesB(firstName, searchString)) {
        // And the same for just a first name match, 1 hit
            if (!numberOfMatches[eachContact]) {
              numberOfMatches[eachContact] = {
                first_name: firstName,
                last_name: lastName,
                hits: 1,
              };
            } else {
              numberOfMatches[eachContact].hits =
                numberOfMatches[eachContact].hits + 1;
            }
          }
        }else if(searchType === "id"){
          if(searchArray[eachContact].id === searchString || Number(searchArray[eachContact].id === Number(searchString))){
            numberOfMatches[eachContact] = {
              id: searchArray[eachContact].id,
              hits: 1
            }
          }
        }else{
      // This is the standard logic, much simpler:
      // if there is only one keyword, there's only one loop
      // This can fit for all searchTypes that are an exact match for an actual contact property name
      // as long as the property can be searched with .includes()
          if(aIncludesB(
            searchArray[eachContact][searchType], 
            searchString
          )){
            if(!numberOfMatches[eachContact]){
              numberOfMatches[eachContact] = {
                [searchType]: searchArray[eachContact][searchType],
                hits: 1
              }
            }else{
              numberOfMatches[eachContact].hits = numberOfMatches[eachContact].hits + 1;
            }
          }
        }
      }
      // return the array of entries, sorted
      return sortResults(numberOfMatches, searchString);
    }
  }
}
