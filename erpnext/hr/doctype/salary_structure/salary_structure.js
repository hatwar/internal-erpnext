// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

cur_frm.add_fetch('employee', 'company', 'company');

cur_frm.cscript.onload = function(doc, dt, dn){
	e_tbl = doc.earnings || [];
	d_tbl = doc.deductions || [];
	if (e_tbl.length == 0 && d_tbl.length == 0)
		return $c_obj(doc,'make_earn_ded_table','', function(r, rt) { refresh_many(['earnings', 'deductions']);});
}

cur_frm.cscript.refresh = function(doc, dt, dn){
	if((!doc.__islocal) && (doc.is_active == 'Yes')){
		cur_frm.add_custom_button(__('Make Salary Slip'),
			cur_frm.cscript['Make Salary Slip'], frappe.boot.doctype_icons["Salary Slip"]);
	}
}

cur_frm.cscript['Make Salary Slip'] = function() {
	frappe.model.open_mapped_doc({
		method: "erpnext.hr.doctype.salary_structure.salary_structure.make_salary_slip",
		frm: cur_frm
	});
}

cur_frm.cscript.employee = function(doc, dt, dn){
	if (doc.employee)
		return get_server_fields('get_employee_details','','',doc,dt,dn);
}

cur_frm.cscript.modified_value = function(doc, cdt, cdn){
	calculate_totals(doc, cdt, cdn);
}

cur_frm.cscript.d_modified_amt = function(doc, cdt, cdn){
	calculate_totals(doc, cdt, cdn);
}

var calculate_totals = function(doc, cdt, cdn) {
	var tbl1 = doc.earnings || [];
	var tbl2 = doc.deductions || [];

	var total_earn = 0; var total_ded = 0;
	for(var i = 0; i < tbl1.length; i++){
		total_earn += flt(tbl1[i].modified_value);
	}
	for(var j = 0; j < tbl2.length; j++){
		total_ded += flt(tbl2[j].d_modified_amt);
	}
	doc.total_earning = total_earn;
	doc.total_deduction = total_ded;
	doc.net_pay = flt(total_earn) - flt(total_ded);
	refresh_many(['total_earning', 'total_deduction', 'net_pay']);
}

cur_frm.cscript.validate = function(doc, cdt, cdn) {
	calculate_totals(doc, cdt, cdn);
	if(doc.employee && doc.is_active == "Yes") frappe.model.clear_doc("Employee", doc.employee);
}

cur_frm.fields_dict.employee.get_query = function(doc,cdt,cdn) {
	return{ query: "erpnext.controllers.queries.employee_query" }
}
cur_frm.cscript.ctc = function(doc, cdt, cdn){
	console.log(doc);
  var gross=doc.ctc;
  var cl=doc.earnings ||[];

  for(var i = 0; i < cl.length; i++){
      if(cl[i].e_type=='Basic') cl[i].modified_value = gross*0.38;
      if(cl[i].e_type=='House Rent Allowance') cl[i].modified_value = gross*0.266;
      if(cl[i].e_type=='Medical Allowance') cl[i].modified_value = gross*0.076;
      if(cl[i].e_type=='Convayance Allowance') cl[i].modified_value=gross*0.076;
      if(cl[i].e_type=='Lunch Allowance') cl[i].modified_value=gross*0.06;
      if(cl[i].e_type=='Others') cl[i].modified_value = gross*0.142;
  }
  refresh_field('earnings');

  var cll=doc.deductions ||[];

  // var cll = getchildren('Salary Structure Deduction', doc.name, 'deduction_details', doc.doctype);
  for(var i = 0; i < cll.length; i++){

      if(cll[i].d_type=='Professional Tax'){
      	console.log("hiiii");
        if(gross<15000) cll[i].d_modified_amt =175;
        else cll[i].d_modified_amt = 200;
      } 
  }
  refresh_field('deductions');
}
