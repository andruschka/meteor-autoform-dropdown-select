![](https://s3.amazonaws.com/f.cl.ly/items/2V2A2d0T0C470q1l471R/simple.png)
# Dropdown-Select (for Autoform + Bootstrap 3)
A custom Dropdown-Select (with Method-based search) for Autoform.  
The available options will be fetched by Methods! (So you don't need to handle Subscriptions - e.g. for huge data stacks...)
## Install
```
meteor add andruschka:autoform-dropdown-select
```
(Of course you need Bootstrap and Autoform installed first!)
## Usage
Just create 2 Methods for fetching the data. The first one is for getting the option Object for an already set value (for example if you are updating an exiting document). The second is for fetching search results as selectable options.
### The option Object
Each option Object needs a value (this will get stored to the DB) and a label (this will be displayed).
```
= {value: "1003", label: "Betawerk"}
```
### Initial Method
Gets (only) invoked by an "update" autoform-field (to get the label for the set value)
- Passes param: the current value of the doc
- Needs to return: an Object (containing a value and label)

### Search Method
Gets invoked when the user types in the search field.
- Passes Param: the current searchString
- Needs to return: an Array with Objects (containing a value and label)

### Example
```javascript
Meteor.methods({
  "supplier_option_by_no": function(no) {
    // initial fetch
    let supplier =  Suppliers.findOne({no})
    // the first Method should return one! doc with label & value
    return {label: supplier.name, value: supplier.no}
  },
  "suppliers_options": function(searchString){
    // for searching
    var result = []
    if (searchString) {
      let rgx = new RegExp(`${searchString}.*`, 'i')
      result =  Suppliers.find({name: rgx}, {limit: 10}).fetch().map(sup => { 
        return {label: sup.name, value: sup.no}
      })
    }
    // the second Method should return the search results as array
    // a result also contains a label and a value
    return result
  }
})
```
Then just set "autoform.type" to 'dropdown-select' and pass the fetchMethods like this:
```javascript
var Item = new SimpleSchema({
  name: {
    type: String,
    index: 1,
    label: "Item Name"
  },
  supplierNo: {
    type: String,
    label: "Supplier",
    autoform: {
      type: 'dropdown-select',
      placeholder: "Select Supplier", // placeholder for button ...
      inputPlaceholder: "Type something ...", // ... and for input
      fetchMethods: {
        initial: 'supplier_option_by_no',
        search: 'suppliers_options'
      }
    }
  }
})
```

