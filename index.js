//searchResults.find(item => item.category==='research').results.d.SearchResults
var mappped = {name: 'reseach',children: []}
// get the data with the flat records
var data = getData().research;
// nested results will be pushed into this array
var mappedResults = [];
// set the nesting hierarchy via level 1,2,3, etc., and provide the key/field name
var keyNames = [{ level: 1, keyName: 'practice' }, { level: 2, keyName: 'subjectArea' }, { level: 3, keyName: 'title' }]
// iterate over each flat record and call the transform to nest
data.map((flatRecord) => { 
  nestedTransform(mappedResults, flatRecord, keyNames, 1);
});

// transform function that handles nesting
function nestedTransform(arrMapped, flatRecord, keyNames, currLevel, existingParent) {
  if (!arrMapped || !flatRecord || !keyNames || !currLevel) { 
    return;
  }
  
  if (!existingParent) {
    var keyName = keyNames.find(item => item.level === currLevel).keyName;
    var existingItem = arrMapped.find(item => item.name === flatRecord[keyName]);
    if (!existingItem) {
      existingItem = { name: flatRecord[keyName], size: 1, children: [] };
      arrMapped.push(existingItem);
    }
    //else { 
      //shouldnt increase size here, but in next level (the parent size should be increased from child based on the number of child nodes (in this case subject areas))
    //  existingItem.size++;
    //}
    nestedTransform(arrMapped, flatRecord, keyNames, ++currLevel, existingItem);
    return;
  }

  if (existingParent && currLevel < keyNames.length) {
    var keyName = keyNames.find(item => item.level === currLevel).keyName;
    var existingItem = existingParent.children.find(item => item.name === flatRecord[keyName]);
    if (!existingItem) {
      existingItem = { name: flatRecord[keyName], size: 1, children: [] };
      //(!existingParent.children || existingParent.children.length < 1)
      existingParent.children.push(existingItem);
      existingParent.size = existingParent.children.length;
    }
    //else { 
      //existingItem.size++;
    //}
    nestedTransform(arrMapped, flatRecord, keyNames, ++currLevel, existingItem);
    return;
  }

  if (existingParent && existingParent.children && currLevel === keyNames.length) {
    var keyName = keyNames.find(item => item.level === currLevel).keyName;
    var existingItem = existingParent.children.find(item => item.name === flatRecord[keyName]);
    if (!existingItem) { 
      var newItem = { name: flatRecord[keyName], size: 1 };
      existingParent.children.push(newItem); 
      existingParent.size = existingParent.children.length;
    }
    return;
  }

  var existingParent = arrMapped.find(item => item.name === flatRecord[keyName]);
  existingParent.size++;
  nestedTransform(arrMapped, flatRecord, keyNames, existingParent);
  return;
}

// view the transformed results
console.log(mappedResults);

// mock flat record data (i.e. ajax response from api)
function getData() {
  return {
    "research": [
      { "practice": "Talent Management", "id": "20992", "title": "Creating a Culture of Leadership", "subjectArea": "Talent Strategy" },
      { "practice": "Talent Management", "id": "20993", "title": "Talent Economics", "subjectArea": "Talent Strategy" },
      { "practice": "Talent Management", "id": "20990", "title": "Finding the Right Talent", "subjectArea": "Recruiting" },
      { "practice": "Human Resources", "id": "20994", "title": "Tips from the Front", "subjectArea": "HR Training" },
      { "practice": "Human Resources", "id": "20995", "title": "Reward Programs", "subjectArea": "Employee Engagement" },
    ]
  }
}
