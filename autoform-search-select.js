AutoForm.addInputType("dropdown-select", {
  template: "afSearchSelect",
  valueOut: function(){
    if (this && this.data('valueOut')) {
      return this.data('valueOut')
    }
  }
})
