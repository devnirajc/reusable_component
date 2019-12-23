import { environment } from '@env/environment';
export const EndPoints = {
    orderChildUrlPath: {
        orderPath : 'v1/order',
        orderSearchPath : 'v1/manage/order/search',
        itemPath: 'order/item',
        manageOrder : 'v1/manage/order',
        manageBulkOrders : 'v1/manage/orders',
        manageSingleOrder : 'v1/manage/order',
        orderTypesPath: 'v1/order/ordertypes',
        orderStatusPath: 'v1/order/orderstatus',
        changeReasonPath: 'v1/order/changereason',
        searchPath: 'v1/order/search',
        lineStatus : 'v1/order/linestatus',
        updatePath: 'order/update/bulk',
        update: 'order/update',
        downloadManageOrderSearchReport: 'v1/manage/order/search/download',
        supplierDeptartment : 'v1/retailsectioncodes'
    },
    inventoryBohPath : {
        fetchBOH : 'v1'
    },
    batchChildUrlPath: {
        bulkUpload: 'v1/batch/upload',
        getAllBatches: 'v1/inbox/search',
        singleBatch: 'v1/batch',
        templateDownloadUrl: './assets/bulk_upload_template_v3.txt'
    },
    groupAssociationChildUrlPath: {
        groupType: 'v1/groupTypes',
        groupSearch: 'v1/groups/search',
        groupCreate: 'v1/groups',
        groupTypeByGroupId: 'v1/groups',
        groupUpdate: 'v1/group',
        releaseGroupSearch : 'v1/groups/crgs'
    },
    customerMasterUrlPath: {
        customers: 'v1/customers',
        customersInGroup: 'v1/customers/groups',
        updateCustomersInGroup: 'v1/customer/groups/add',
        customersByGroupType: 'v1/customers/groupType',
        retrieveCustomerTypes: 'v1/customers/types'
    },
    attributeMasterUrlPath: {
        searchAttribute: 'v1/attribute-search',
        createAttributeRules: 'api/v1/attributes',
        updateAttributeRules: 'api/v1/attributes'
    },
    attributeMaintenanceUrlPath: {
        createAttribute: 'v1/attributes',
        editAttributeRules: 'v1/attributes',
        autoHoldingSearch: 'v1/attribute-search-auto-hold'
    },
    manageUserUrlChildUrlPath: {
        viewPermissions: 'v1/groups/permissions',
        getPermissionsByGroupId: 'v1/permissions',
        postPermissionsOfGroupId: 'v1/permissions',
        getCapabilities: 'v1/capabilities',
        getCategories: 'v1/categories',
        groups: 'v1/groups',
        users: 'v1/users',
        assignUsersToGroup : 'v1/users/mapping',
        userPermissions : 'v1/permissions/user'
    },
    sourceOfSupplyUrlChildUrlPath: {
        sosSearch: 'v1/sos/search',
        sosCreate: 'v1/sos',
        sosRead: 'v1/sos/get'
    },
    supplierMasterChildUrlPath: {
        suppliers: 'v1/suppliers',
        getAllSupplierByDcId: 'v1/distCenterId'
    },
    orderAllocationChildPathUrl : {
        cancellation : 'api/v1/allocation/product/cancel',
        replacement : 'api/v1/allocation/product/replace',
        allocation : 'api/v1/allocation/product/review',
        search : 'api/v1/allocation/product/search',
        review : 'api/v1/allocation/product/quantity',
        substitutionReview : 'api/v1/allocation/product/substitution/review'
    },
    productMasterChildPathUrl : {
        products : 'v1/products'
    },
    autoHoldingChildPathUrl : {
        search : 'v1/attribute-search-auto-hold'
    },
    changeLogPathUrl : {
        fetchInfo: '/v1/auditOrder',
        auditChangeReasonPath: '/v2/order/changereason',
        contextTypePath: '/v2/order/changereason/contexttype'
    },
    camsDownloadChildPathUrl : {
        extractOrders : 'v1/search',
        downloadExtractedOrders : 'v1/download',
        reTrigger: 'v1/retrigger/search',
        resendReTrigger: 'v1/retrigger/download'
    },
    releaseScheduleChildPathUrl : {
        searchRelSchedule : 'v1/schedule/search',
        createRelSchedule : 'v1/schedule',
        editRelSchedule : 'v1/schedule',
        orderTypes : 'v1/schedule/orderTypes'
    },
    inboundScheduleChildPathUrl : {
        searchInboundSchedule : 'v1/schedule/search',
        createInboundSchedule : 'v1/inbound/schedules',
        editInboundSchedule : 'v1/inbound/schedules',
        getInboundSchedule : 'v1/schedule'
    },
    maintainScheduleIdChildPathUrl : {
        searchScheduleId : 'v1/scheduleid/search',
        createAndEditScheduleId : 'v1/scheduleids',
        retriveScheduleId : 'v1/scheduleids',
        listScheduleId : 'v1/scheduleids'
    },
    errorLogPathUrl : {
        fetchByCustomerOrderId: '/v1/exceptionManager/customer',
        fetchBySupplierOrderId: '/v1/exceptionManager/supplier'
    },
    transporterChildPathUrl: {
        createTOG: 'v1/togs',
        editTOG:   'v1/togs',
        searchTOG: '/v1/togs/search',
        orderMonitor : 'v1/ordermonitor/search',
        routeCode: 'v1/tog/routecode/'

    },
    transportAssociationChildPathUrl: {
        TogAssociationsearch: 'v1/tog-associations-rule/search',
        TogAssociationDelete: 'v1/tog-associations-rule/delete',
        createTogAssociationRules: 'v1/tog-associations-rule'
    },
    manageConfigChildPathUrl: {
        manageConfigSearch: 'v1/distcenter/config',
        manageConfigUpdate: 'v1/distcenter/config'
    }
};

