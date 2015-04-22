# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and Contributors and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import flt, cstr
from frappe import msgprint, _

def execute(filters=None):
	if not filters: filters = {}
	
	salary_slips = get_salary_slips(filters)
	columns = get_columns(salary_slips)
	
	data = []
	for ss in salary_slips:
		row = [ss.employee, ss.employee_name, ss.month, ss.total_days_in_month,ss.leave_without_pay,
			 ss.payment_days, ss.gross_pay, ss.total_deduction, ss.net_pay, ss.bank_account_no,
			 ss.payment_schedule,ss.docstatus,ss.monthly_ctc
			 ]
			
		data.append(row)
	
	return columns, data
	
def get_columns(salary_slips):
	columns = [
		_("Employee") + ":Link/Employee:120", _("Employee Name") + "::140", 
		("Month") + "::140",_("Working Days")+ "::140",("Leave Without Pay")+ ":Float:140",
		("Payment Days")+"::140",("Gross Pay")+":Currency:120",("Total Deduction")+":Currency:120",
		("Net Pay")+":Currency:120",("Bank Account No")+"::140", ("Payment Schedule")+":date:120",
		("Document Status")+"::120", ("Monthly CTC")+":Currency:120"
	]
	
	
	return columns
	
def get_salary_slips(filters):
	conditions, filters = get_conditions(filters)
	salary_slips = frappe.db.sql("""select * from `tabSalary Slip` where docstatus != 2 %s
		order by employee, month""" % conditions, filters, as_dict=1)
	
	if not salary_slips:
		msgprint(_("No salary slip found for month: ") + cstr(filters.get("month")) + 
			_(" and year: ") + cstr(filters.get("fiscal_year")), raise_exception=1)
	
	return salary_slips
	
def get_conditions(filters):
	conditions = ""
	if filters.get("month"):
		month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", 
			"Dec"].index(filters["month"]) + 1
		filters["month"] = month
		conditions += " and month =	 %(month)s"
	
	# if(filters.get("month")==""):
	# 	msgprint(_("please select moonth"))


	if filters.get("employee"): conditions += " and employee = %(employee)s"
	
	return conditions, filters
	