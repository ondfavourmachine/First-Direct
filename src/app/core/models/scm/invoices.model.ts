

export interface CreateAnInvoice{
  totalPayable?: any,
  subTotal?:any
  session: string,
  username: string,
  subsidiaryId: string,
  countryId: string,
  invoiceNo: string,
  invoiceDate: string,
  purchaseOrderNo: string,
  buyer: string,
  supplyDate: string,
  paymentDueDate: string,
  invoiceSummary: string,
  acceptedOffline: string,
  paymentTerms: string,
  additionalInformation: string,
  hasAttachment: string,
  tax: number,
  discount: number,
  miscellaneous: number,
  createdBy: string,
  calculatedDiscount?: string,
  calculatedTax?: string;
  invoiceValues: InvoiceValue[],
    isAccepted?: false,
    isActive?: true,
    isDeleted?: false,
    dateCreated?: "2022-10-14T10:49:19.93",
    modifiedBy?: null,
    dateModified?: null,
    approvedBy?: null,
    dateApproved?: null,
    deletedBy?: null,
    dateDeleted?: null,
}

export type InvoiceValue = {
      item: '',
      invoiceNo: '',
      unitPrice: number,
      quantity: number,
      amount: number
}


export type CreateInvoiceResponse = {
  code: string
data: boolean
message: string
}

export type GetInvoiceModel = {
  session: string,
  username: string,
  subsidiaryId: string,
  countryId: string,
  searchQuery: string,
  sortColumn: string,
  filter: string,
  pageNumber: number,
  pageSize: number,
  invoiceNo: string,
  invoiceStatus: string
}

export interface GeneralGetResponses<T>{
  currentPage: number,totalPages:number,pageSize:number,totalCount:number,hasPrevious:boolean,hasNext:boolean,
  data: T
  
}

export type FailedResponse ={
  code: string, data: boolean, message: string
}
