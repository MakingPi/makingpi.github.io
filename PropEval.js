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

function getSelectedRadioValue( id ){
  var radio_group = document.getElementById( id );
  for (i=0; i<radio_group.childElementCount; i++) {
    if (radio_group.children[i].checked) {
      return radio_group.children[i].value;
    }
  }
  return null;
}

function valueUpdated() {
 // read variables
 var full_price = parseInt(document.getElementById("full_price").value);
 var taxes = parseInt(document.getElementById("taxes").value);
 var repair_cost = parseInt(document.getElementById("repair_cost").value);
 var prosper_down = parseInt(document.getElementById("prosper_down").value);
 var k401_down = parseInt(document.getElementById("k401_down").value);
 var mtgt_apr = parseFloat(document.getElementById("mortgage_apr").value);
 var gross_rent = parseInt(document.getElementById("gross_rent").value);
 var insurance_payments = parseFloat(document.getElementById("insurance_payments").value);
 var water_payments = parseInt(document.getElementById("water_payments").value);
 var snow_payments = parseInt(document.getElementById("snow_payments").value);

 // read radio buttons
 var tax_months = parseInt(getSelectedRadioValue('tax_term_radios'));
 var mtgt_term = parseInt(getSelectedRadioValue('mtgt_term_radios'));
 var cash_down_radios_val = getSelectedRadioValue('cash_down_radios');
 var mx_radios_val        = getSelectedRadioValue('mx_radios');
 var vacancy_radios_val   = getSelectedRadioValue('vacancy_radios');
 var mgmt_radios_val      = getSelectedRadioValue('mgmt_radios');

 var cash_down = document.getElementById("cash_down");
 switch( cash_down_radios_val )
 {
   case 'custom':
    cash_down.disabled = false;
    break;
    case '20p':
    cash_down.disabled = true;
    cash_down.value = ((0.20 * full_price) + repair_cost - k401_down - prosper_down).toFixed(2);
    break;
    case '25p':
    cash_down.disabled = true;
    cash_down.value = ((0.25 * full_price) + repair_cost - k401_down - prosper_down).toFixed(2);
    break;
 }
 cash_down = parseInt(cash_down.value);

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
 document.getElementById("loan_payments").value = loan_payments.toFixed(2);
 var tax_payments = (taxes / tax_months);
 document.getElementById("tax_payments").value = tax_payments.toFixed(2);

 var maint_payments = document.getElementById("maint_payments");
 switch( mx_radios_val ){
    case '15pRent':
      maint_payments.value = (gross_rent * 0.15).toFixed(2); // 15%
      maint_payments.disabled = true;
      break;
    case '1pValue':
      maint_payments.value = (((full_price + repair_cost) * 0.010) / 12).toFixed(2); // monthly rate for 1% annually
      maint_payments.disabled = true;
      break;
    case '1.5pValue':
      maint_payments.value = (((full_price + repair_cost) * 0.015) / 12).toFixed(2); // monthly rate for 1.5% annually
      maint_payments.disabled = true;
      break;
    case 'custom':
      maint_payments.disabled = false;
      break;
 }
 maint_payments = parseInt(maint_payments.value);

 var vacancy_payments = document.getElementById("vacancy_payments");
 switch( vacancy_radios_val ){
   case '1yr':
      vacancy_payments.value = (gross_rent/11).toFixed(2); // need to get a full month rent from 11 months of living
      break;
   case '2yr':
     vacancy_payments.value = (gross_rent/23).toFixed(2); // need to get a full month rent from 23 months of living
     break;
   case '5yr':
     vacancy_payments.value = (gross_rent/59).toFixed(2); // need to get a full month rent from 59 months of living
     break;
 }
 vacancy_payments = parseInt(vacancy_payments.value);

 var mgmt_payments = document.getElementById("mgmt_payments");
 switch( mgmt_radios_val ){
   case 'full':
      mgmt_payments.value = (gross_rent * 0.10).toFixed(2); // 10%
      break;
   case 'partial':
      mgmt_payments.value = (gross_rent * 0.06).toFixed(2);
      break;
   case 'self':
      mgmt_payments.value = 49.95;
      break;
 }
 mgmt_payments = parseInt(mgmt_payments.value);

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
