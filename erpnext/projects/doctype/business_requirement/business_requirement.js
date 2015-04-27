cur_frm.cscript.refresh=function(){
	
		cur_frm.add_custom_button(__('Make Functinal Requirement'),this.make_functional_requirement, 'icon-retweet');
}
cur_frm.cscript.make_functional_requirement = function() {
	frappe.model.open_mapped_doc({
		method: "erpnext.projects.doctype.business_requirement.business_requirement.make_functional_requirement",
		frm: cur_frm
	});
}