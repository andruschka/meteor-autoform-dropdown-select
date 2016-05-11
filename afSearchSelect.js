Template.afSearchSelect.onCreated(function() {
  // vars
  let {atts} = this.data
  this.dsKey = atts['data-schema-key']
  
  this.loading = new ReactiveVar(false)
  this.initialOption = new ReactiveVar()
  this.searchInput = new ReactiveVar("")
  this.searchResults = new ReactiveVar([])
  this.selectedOption = new ReactiveVar()
  
  // helpers
  this.placeholder = function(){
    return atts.placeholder || "Select one"
  }  
  this.valueOut = function(){
    if (this.selectedOption.get()) {
      return this.selectedOption.get().value
    } else if (this.initialOption.get()) {
      return this.initialOption.get().value
    }
  }
  this.labelOut = function(){
    if (this.selectedOption.get()) 
      return this.selectedOption.get().label
    else if (this.initialOption.get())
      return this.initialOption.get().label
    else if (this.data.value)
      return this.data.value
    else if (atts.placeholder)
      return atts.placeholder
    else
      return "Select one ..."
  }
  this.inputPlaceholder = function() {
    return atts.inputPlaceholder || "Search here ..."
  }
  this.additionalClasses = function() {
    let className = ""
    if (this.data.atts.fullWidth) 
      className += "full-width"
    if (this.data.atts.className)
      className += this.data.atts.className
    return className
  }
  
  // get data on search
  this.autorun(()=> {
    this.loading.set(true)
    Meteor.call(atts.fetchMethods.search, this.searchInput.get(), (err, res)=> {
      this.loading.set(false)
      if (err)
        console.error(err)
      else if (res)
        this.searchResults.set(res)
    })
  })

})

Template.afSearchSelect.onRendered(function() {
  // HACK: needed to transfer this to onRendered ... :-/
  // get initial data
  let {atts} = this.data
  Meteor.defer(()=>{
    if (this.data.value) {
      this.loading.set(true)
      Meteor.call(atts.fetchMethods.initial, this.data.value, (err, res)=> {
        this.loading.set(false)
        if (err)
          console.error(err)
        else if (res) 
          this.initialOption.set(res)
      })
    }
  })
})


Template.afSearchSelect.events({
  "keyup input.search-input": function(evt, instance){
    evt.preventDefault()
    instance.searchInput.set(evt.currentTarget.value.trim())
  },
  "click .selectable-option": function(evt, instance){
    evt.preventDefault()
    instance.selectedOption.set(this)
  }
})


Template.afSearchSelect.helpers({
  "instance": ()=> Template.instance()
})




