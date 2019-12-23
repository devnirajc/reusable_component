export const Messages = {
    'orderType': {
        'required': 'Please select an order type',
        'isRequired': 'Order type is required'
    },
    'orderTypeId': {
        'required': 'Order Type is required',
    },
    'customerId': {
        'required': 'Customer is required',
        'validation': 'Customer not found',
        'invalidCustomer': 'Invalid Customer',
        'customernotmapped' : 'Customer not belongs to selected division id'
    },
    'customerGroupId': {
        'required': 'Customer group id is required',
        'validation': 'Customer group not found',
        'notValidGroupType': 'Customer group Id not belongs to order group'
    },
    'crgLabel': {
        'required': 'Customer release group is required',
        'validation': 'Customer release group not found',
        'valid' : 'Customer release group not belong to Release Group'
    },
    'transferType': { 'required': 'Please select transfer type' },
    'poRefNumber': { 'required': 'Reference Doc is required' },
    'routeCode': {
        'required': 'Route code is required',
        'minLength': 'Route code must be max 2 characters only.',
        'isRequired': 'Required',
        'validation': 'Route code not found'
    },
    'processingDate': { 'required': 'Required' },
    'releaseDate': { 'required': 'Please select process date' },
    'deliveryDate':
        { 'required': 'Please select delivery date', 'requiredOnly': "Required" },
    'itemNumber': {
        'required': 'Product number is required',
        'validation': 'Product number not found',
        'duplicate': 'Duplicate item found'
    },
    'productId': {
        'required': 'Product number is required',
        'validation': 'Product number not found',
        'itemNotFoundSupplier': 'Product number not found for this supplier',
        'itemNotFoundCust': 'Product number not found for this Customer'
    },
    'quantity': {
        'required': 'Required'
    },
    'itemChangeReason': {
        'required': 'Required'
    },
    'updatedQty': {
        'required': 'Required'
    },
    'emailId': {
        'required': 'Email id is required',
        'email': 'Email id must be valid'
    },
    'comments': {
        'required': 'Comments are required'
    },
    'additionUpto': 'You can add only upto ',
    'minItemLimitForCreation': 'Atleast one record is mandatory',
    'records': 'records',
    'supplierId': {
        'required': 'Supplier is required',
        'validation': 'Supplier not found',
        'invalid': 'Invalid',
        'isRequired': 'Required'
        //'duplicate': 'Duplicate supplier found'
    },


    'searchError': {
        'atleastOneField': 'Please fill out at least one field to search',
        'serverError': 'Service error! Please try again.',
        'fieldRequired': 'Please fill out below field to search',
        'orderAllocationSearchErrorforItemNumber': 'Product number is mandatory',
        'orderAllocationSearchErrorforAllocation': 'Allocation type is manadatory',
        'orderAllocationSearchErrorForBoth': 'Product Number and Allocation Type is manadatory field',
        'permissionsGroupId': 'Group Name required',
        'mandatorySupplier': 'Supplier is mandatory with Supplier Product Number',
        'invalidCustomer': 'Invalid Customer Id',
        'allFieldRequired': 'Please fill out all the below fields to search',
        'cuttoffendcutoffTime': 'Please fill out Cut-Off Date/ Time and End Cut-Off Date/ Time'
    },
    'noDataFound': 'No records found',
    'groupLabel': { 'required': 'Group name is required', 'maxlength': 'Maximum characters length is 10', 'pattern': 'Special character not allowed', 'validation': 'Group name already exists' },
    'groupType': { 'required': 'Group type is required' },
    'division': {
        'required': 'Division is required'
    },
    'priority': {
        'required': 'Priority is required'
    },
    'maxItemOrderQty': {
        'required': 'Quantity is required'
    },
    'isRequired': 'Value is required',
    'cogId': {
        'required': 'COG is required',
        'validation': 'COG not found',
        'notFound' : 'Customer group does not belongs to Order Group'
    },
    'crgId': {
        'validation': 'CRG not found',
        'required': 'CRG is required',
        'notFound' : 'Customer group does not belongs to Release Group'
    },
    'cog': {
        'required': 'COG is required',
        'validation': 'COG not found'
    },
    'replacementId': {
        'required': 'Substitution id is required',        
        'itemNotFoundSupplier': 'Product number not found for this supplier',
        'validation': 'Product not found',
        'duplicate': 'Substituted product number should not be same as original product number',
    },
    'changeReason': {
        'required': 'Please select change reason'
    },
    'CHANGE_REASON_ID': {
        'required': 'Please select change reason'
    },
    'quantityAdjustment': {
        'required': 'Quantity multiplier is required',
        'pattern': 'Quantity multiplier should be decimal or fractional value'
    },
    'divisionId': {
        'required': 'Division is required',
        'requiredOnly': 'Required'
    },
    'groupId': {
        'required': 'Group name is required',
        'validation': 'Group name already taken',
        'maxlength': 'Maximum characters length is 20'
    },
    'description': {
        'required': 'Group Description is required',
        'maxlength': 'Maximum characters length is 30',
        'pattern': 'Special character not allowed',
    },
    'userId': {
        'required': 'User Id is required',
        'validation': 'User Id already taken',
        'invalidField': 'Invalid field',
        'maxlength': 'Maximum characters length is 10'
    },
    'firstName': {
        'required': 'First Name is required',
        'invalidField': 'Invalid field'
    },
    'lastName': {
        'required': 'Last Name is required',
        'invalidField': 'Invalid field'
    },
    'maxItemLimitValidation': 'Max Product quantity should be greater than Min Product quantity',
    'maxItemLimitValidationZero': 'Max Product quantity should be greater than zero',
    'palletUpLimitValidation': 'Pallet round up should be greater than Pallet round down',
    'caseUpLimitValidation': 'Case round up should be greater than Case round down',
    'maxOrderLimitValidation': 'Max order quantity should be greater than Min order quantity',
    'allocationType': {
        'required': 'Allocation type is required'
    },
    'email': {
        'required': 'Email id is required',
        'email': 'Email id must be valid'
    },
    'MAX_QTY': {
        'required': 'Max order quantity is required'
    },
    'status': {
        'required': 'Required'
    },
    'changeReasonId': {
        'required': 'Required'
    },
    'customerDivision': {
        'required': 'Customer division is required',
        'requiredOnly': 'Required'
    },
    'dcNumber': {
        'required': 'DC number is required'
    },
    'physicalWarehouse': {
        'required': 'Physical warehouse is required',
        'requiredOnly': 'Required'
    },
    'tog1': {
        'required': 'TOG1 is required',
        'exists': 'TOG already exists',
        'validation' : 'TOG Not Found',
        'duplicate' : 'Duplicate TOG found'
    },
    'tog2': { 'duplicate' : 'Duplicate TOG found' },
    'tog3': { 'duplicate' : 'Duplicate TOG found' },
    'tog4': { 'duplicate' : 'Duplicate TOG found' },
    'tog5': { 'duplicate' : 'Duplicate TOG found' },
    'tog': {
        'required': 'TOG is required',
        'duplicate': 'Duplicate TOG found',
        'exists': 'TOG already exists',
        'validation' : 'TOG Not Found'
    },
    'togs': {
        'required': 'TOG is required'
    },
    'TOG': { 'maxlength': 'Maximum characters length is 6' },
    'downloadType': {
        'required': 'Download type is required'
    },
    'class': {
        'required': 'Class is Required'
    },
    'origin': {
        'required': ' Origin is Required'
    },
    'destination': {
        'required': 'Destination is Required'
    },
    'cutoffDate': {
        'required': 'Cut-Off Date is required'
    },
    'cutoffTime': {
        'required': 'Cut-Off Time is required'
    },
    'endCutoffDate': {
        'required': 'End Cut-Off Date is required'
    },
    "Rdiv": {
        'required': 'Rdiv is required'
    },
    'enterFilename': {
        'required': 'Filename is required'
    },
    'fileName': {
        'maxlength': 'Maximum characters length is 8'
    },
    'selectcustomer': {
        'required': 'Please select customer type'
    },
    'scheduleId': {
        'required': 'Schedule Id is required',
        'validation': 'Schedule Id not found',
        'duplicate': 'Duplicate Schedule Id found'
    },
    'userSchedId': {
        'required': 'Schedule Id is required',
        'duplicate': 'Duplicate Schedule Id found',
        'exists': 'Schedule Id already exists'
    },
    'scheduleDescription': {
        'required': 'Description is required'
    },
    'scheduleDesc': {
        'required': 'Description is required'
    },
    'effectiveDate': {
        'required': 'Effective Date is required'
    },
    'neweffectiveDate': {
        'required': 'New Effective Date is required'
    },
    'expiryDate': {
        'required': 'Expiry Date is required'
    },
    'attributeMaintenance': {
        'Pallet': 'Pallet Round Up should be greater then Pallet Round Down',
        'Case': 'Case Round Up should be greater then Case Round Down',
        'Item': 'Max Product Quantity should be greater then Min Product Quantity',
        'Order': 'Max Order Quantity should be greater then Min Order Quantity',
    },
    'crg': {
        'validation': 'Customer release group already exists'
    },
    'releaseSchedule': {
        'fillField': 'Please fill the "Distribution Center ID" to search',
        'invalidTime': 'Invalid time format',
        'atleastOneOrderType': 'Atleast one order type must be Y',
        'atleaseOneProcessDate': 'Atleast one process day & order type must be Y',
        'atleastOneProDayY': 'Atleast one process day must be Y',
        'inValidCRG': 'Invalid CRG'
    },
    'endTime': {
        'required': 'End Time is required',
        'validation': 'Start time should be less than End time'
    },
    'processDay' : {
        'required': 'Please select process Day'
    },
    'startTime': {
        'required': 'Start Time is required',
        'validation': 'Start time should be less than End time'
    },
    'distCenter' : {
        'required': 'Distribution center is Required'
    },
    'endEffectiveDate' : {
        'required': "Effective end date is required"
    },
    'startEffectiveDate' : {
        'required' : "Effective start date is required"
    },
    'totalQuantity' : {
        'required' : "Total quantity is required"
    },
    'manageConfig': {
        'fillField': 'Please fill the "Distribution Center ID" to search'
    },
    'selectOption': {
        'required': 'Required'
    }
}