function getPayment( amount, apr, months ){
 // calculate payment using formula           i * (1+i)^n
 //	                               M = P *  ---------------
 //                                           (1+i)^n  - 1
 // M = monthly payment, P = principal amount, i = interest rate, expressed as monthly decimal, n = number of payments

 var M;
 var P = amount;
 var i = apr / 1200.0; // convert from % to decimal, then convert to monthly rate.
 var intermediate = 1 + i;
 intermediate = Math.pow(intermediate, months);
 M = P * i * intermediate / (intermediate - 1);

 return M;
}

function valueUpdated() {
 // read variables
 var full_price = parseInt(document.getElementById("full_price").value);
 var taxes = parseInt(document.getElementById("taxes").value);
 var repair_cost = parseInt(document.getElementById("repair_cost").value);
 var cash_down = parseInt(document.getElementById("cash_down").value);
 var prosper_down = parseInt(document.getElementById("prosper_down").value);
 var k401_down = parseInt(document.getElementById("k401_down").value);
 var mtgt_apr = parseFloat(document.getElementById("mortgage_apr").value);
 var gross_rent = parseInt(document.getElementById("gross_rent").value);
 var insurance_payments = parseFloat(document.getElementById("insurance_payments").value);
 var water_payments = parseInt(document.getElementById("water_payments").value);
 var snow_payments = parseInt(document.getElementById("snow_payments").value);

 // read radio buttons
 var tax_term_radios = document.getElementById("tax_term_radios");
 var tax_months;
 for (i=0; i<tax_term_radios.childElementCount; i++) {
   if (tax_term_radios.children[i].checked) {
     tax_months = parseInt(tax_term_radios.children[i].value);
   }
 }

 var mtgt_term_radios = document.getElementById("mtgt_term_radios");
 var mtgt_term;
 for (i=0; i<mtgt_term_radios.childElementCount; i++) {
   if (mtgt_term_radios.children[i].checked) {
     mtgt_term = parseInt(mtgt_term_radios.children[i].value);
   }
 }

 // do fancy calculations
 var mtgt_amount = (full_price + repair_cost) - (cash_down + prosper_down + k401_down);
 document.getElementById("mtgt_amount").value = mtgt_amount > 0 ? mtgt_amount : 0;

 var long_payment = getPayment(mtgt_amount, mtgt_apr, mtgt_term);
 document.getElementById("long_payments").value = long_payment.toFixed(2);

 var short_p2p = getPayment(prosper_down, 7.25, 60);
 var short_401k = getPayment(k401_down, 5.25, 60);
 document.getElementById("short_payments").value = (short_p2p + short_401k).toFixed(2);

 // fill out simple calculations
 var loan_payments = long_payment + short_401k + short_p2p;
 var tax_payments = (taxes / tax_months);
 var maint_payments = (gross_rent * 0.15); // 15%
 var vacancy_payments = (gross_rent * 0.08); // 8%
 var mgmt_payments = (gross_rent * .1); // 10%

 document.getElementById("loan_payments").value = loan_payments.toFixed(2);
 document.getElementById("tax_payments").value = tax_payments.toFixed(2);
 document.getElementById("maint_payments").value = maint_payments.toFixed(2);
 document.getElementById("vacancy_payments").value = vacancy_payments.toFixed(2);
 document.getElementById("mgmt_payments").value = mgmt_payments.toFixed(2);

 // show NOI
 var noi_now = gross_rent - loan_payments - tax_payments - maint_payments - vacancy_payments - mgmt_payments - insurance_payments - water_payments - snow_payments;
 var noi_5yr = noi_now + short_401k + short_p2p;
 var noi_30yr = noi_5yr + long_payment;

 document.getElementById("noi_now").innerHTML = noi_now.toFixed(2);
 document.getElementById("noi_5yr").innerHTML = noi_5yr.toFixed(2);
 document.getElementById("noi_30yr").innerHTML = noi_30yr.toFixed(2);

 document.getElementById("roi_now").innerHTML = ((noi_now * 1200) / full_price).toFixed(2);
 document.getElementById("coc_now").innerHTML = ((noi_now * 1200) / cash_down).toFixed(2);

 document.getElementById("roi_5yr").innerHTML = ((noi_5yr * 1200) / full_price).toFixed(2);
 document.getElementById("coc_5yr").innerHTML = ((noi_5yr * 1200) / cash_down).toFixed(2);

 document.getElementById("roi_30yr").innerHTML = ((noi_30yr * 1200) / full_price).toFixed(2);
 document.getElementById("coc_30yr").innerHTML = ((noi_30yr * 1200) / cash_down).toFixed(2);
}

function pageLoaded() {
   valueUpdated();
}
