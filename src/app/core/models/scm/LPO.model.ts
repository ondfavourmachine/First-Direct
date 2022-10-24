export interface requestLpoBody {
        session: string;
        username: string;
        subsidiaryId: string;
        countryId: string;
        searchQuery: string;
        sortColumn: string;
        filter: string;
        pageNumber: number;
        pageSize: number;
}

export interface addLpoModel {
    session: string;
    username: string;
    subsidiaryId: string;
    purchaseOrderDate: string;
    purchaseOrderNo: string;
    subsidiaryCode: string;
    // buyerId: number;
    supplierId: number;
    supplyDate: string;
    paymentDueDate: string;
    purchaseOrderSummary: string;
    acceptedOffline: boolean;
    paymentTerms: string;
    additionalInformation: string;
    hasAttachment: boolean;
    purchaseOrderStatus: string;
    // tax: number;
    // discount: number;
    miscellaneous: number;
    total: number;
    currencyCode: string;
    countryId: string;
    dateCreated: string;
    items: [
      {
        item: string;
        unitPrice: number;
        quantity: number;
        amount: number;
      }
    ];
    attachments: [
      {
        fileName: string;
        documentBase64: string;
      }
    ]
  }

  export interface itemsListModel {
    item: string;
    unitPrice: number;
    quantity: number;
    amount: number;
  }

  export interface updatingLpoModel {
    session: string;
    username: string;
    subsidiaryId: string;
    countryId: string;
    purchaseOrderId: number;
    comment: string;
  }

  export interface downloadLpoModel {
    session: string;
    username: string;
    subsidiaryId: string;
    countryId: string;
    purchaseOrderId: number;
  }